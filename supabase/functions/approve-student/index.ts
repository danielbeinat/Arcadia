import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApprovalRequest {
  studentId: string;
  action: 'APROBADO' | 'RECHAZADO';
  adminId: string;
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get request body
    const { studentId, action, adminId, reason }: ApprovalRequest = await req.json()

    // Validate input
    if (!studentId || !action || !adminId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: studentId, action, adminId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!['APROBADO', 'RECHAZADO'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be APROBADO or RECHAZADO' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get student information
    const { data: student, error: studentError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', studentId)
      .single()

    if (studentError || !student) {
      return new Response(
        JSON.stringify({ error: 'Student not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify admin permissions
    const { data: admin, error: adminError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single()

    if (adminError || !admin || admin.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update student status
    const { data: updatedStudent, error: updateError } = await supabaseClient
      .from('users')
      .update({
        status: action,
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update student status' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log the action
    const { error: logError } = await supabaseClient
      .from('admin_actions')
      .insert([{
        admin_id: adminId,
        action_type: 'STUDENT_APPROVAL',
        target_user_id: studentId,
        details: {
          previous_status: student.status,
          new_status: action,
          reason: reason || null
        },
        created_at: new Date().toISOString()
      }])

    if (logError) {
      console.error('Failed to log admin action:', logError)
      // Continue execution - logging failure shouldn't stop the process
    }

    // Send email notification
    try {
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-approval-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: student.email,
          studentName: student.name,
          status: action,
          reason: reason,
          universityName: 'AcademiaNova',
          program: student.program
        })
      })

      if (!emailResponse.ok) {
        console.error('Failed to send email notification')
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
      // Continue - email failure shouldn't stop the approval process
    }

    // Create system notification for real-time updates
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert([{
        user_id: studentId,
        type: action === 'APROBADO' ? 'APPROVAL' : 'REJECTION',
        title: action === 'APROBADO' ? '🎉 ¡Solicitud Aprobada!' : '❌ Solicitud Rechazada',
        message: action === 'APROBADO'
          ? `¡Felicitaciones ${student.name}! Tu solicitud de ingreso ha sido aprobada. Bienvenido a AcademiaNova.`
          : `Hola ${student.name}, tu solicitud necesita revisión. ${reason ? `Motivo: ${reason}` : 'Por favor, revisa tus documentos y vuelve a intentar.'}`,
        created_at: new Date().toISOString(),
        read: false
      }])

    if (notificationError) {
      console.error('Failed to create notification:', notificationError)
    }

    // Prepare response data
    const responseData = {
      success: true,
      message: `Student ${action.toLowerCase()} successfully`,
      data: {
        studentId: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        previousStatus: student.status,
        newStatus: updatedStudent.status,
        updatedAt: updatedStudent.updated_at,
        processedBy: adminId,
        reason: reason || null
      }
    }

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
