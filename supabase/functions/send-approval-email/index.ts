import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  studentEmail: string;
  studentName: string;
  status: 'APROBADO' | 'RECHAZADO';
  reason?: string;
  universityName: string;
  program: string;
}

const createApprovalEmailHTML = (data: EmailRequest): string => {
  const isApproved = data.status === 'APROBADO';
  const statusColor = isApproved ? '#10B981' : '#EF4444';
  const statusEmoji = isApproved ? '🎉' : '❌';
  const statusText = isApproved ? 'APROBADA' : 'RECHAZADA';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización de Solicitud - ${data.universityName}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .content {
                padding: 40px 30px;
            }
            .status-badge {
                display: inline-block;
                background-color: ${statusColor};
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                line-height: 1.8;
                color: #4a5568;
                margin-bottom: 25px;
            }
            .highlight {
                background-color: #e6fffa;
                border-left: 4px solid #38b2ac;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            .reason-box {
                background-color: #fef5e7;
                border: 1px solid #f6ad55;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .reason-box h4 {
                color: #c05621;
                margin: 0 0 10px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                transition: transform 0.2s;
                margin: 20px 0;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background-color: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
                color: #718096;
                font-size: 14px;
            }
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${statusEmoji} ${data.universityName}</h1>
                <p>Actualización sobre tu solicitud de ingreso</p>
            </div>

            <div class="content">
                <div class="status-badge">
                    Solicitud ${statusText}
                </div>

                <h2>Estimado/a ${data.studentName},</h2>

                <div class="message">
                    ${isApproved
                        ? `¡Tenemos excelentes noticias! Tu solicitud de ingreso al programa de <strong>${data.program}</strong> ha sido <strong>aprobada</strong>.`
                        : `Lamentamos informarte que tu solicitud de ingreso al programa de <strong>${data.program}</strong> no ha sido aprobada en esta ocasión.`
                    }
                </div>

                ${isApproved ? `
                    <div class="highlight">
                        <h3>🎓 ¡Bienvenido/a a ${data.universityName}!</h3>
                        <p>Estamos emocionados de tenerte como parte de nuestra comunidad académica. A partir de ahora, tendrás acceso completo a:</p>
                        <ul>
                            <li>📚 Sistema de inscripción a cursos</li>
                            <li>👥 Portal estudiantil completo</li>
                            <li>📖 Biblioteca digital</li>
                            <li>🏫 Campus virtual</li>
                            <li>💬 Comunidad estudiantil</li>
                        </ul>
                    </div>

                    <a href="${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/dashboard" class="button">
                        Acceder a mi Dashboard
                    </a>
                ` : `
                    <div class="reason-box">
                        <h4>Motivo de la decisión:</h4>
                        <p>${data.reason || 'Por favor, revisa que todos tus documentos estén completos y sean legibles. Puedes volver a enviar tu solicitud cuando hayas actualizado la información requerida.'}</p>
                    </div>

                    <div class="message">
                        <p>No te desanimes. Puedes revisar tu solicitud, actualizar la documentación necesaria y volver a aplicar cuando estés listo/a.</p>
                        <p>Si tienes preguntas sobre este proceso, no dudes en contactarnos.</p>
                    </div>

                    <a href="${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/profile" class="button">
                        Revisar mi Perfil
                    </a>
                `}

                <div class="message">
                    <p><strong>Recuerda:</strong> Mantén tu información de contacto actualizada para recibir futuras comunicaciones importantes.</p>
                </div>
            </div>

            <div class="footer">
                <p><strong>${data.universityName}</strong></p>
                <p>Tu futuro académico comienza aquí</p>

                <div class="social-links">
                    <a href="#">📧 Soporte</a>
                    <a href="#">📞 Contacto</a>
                    <a href="#">🌐 Portal Web</a>
                </div>

                <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
                    Este es un mensaje automático del sistema de ${data.universityName}.<br>
                    Si tienes preguntas, contacta a nuestro equipo de soporte.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const createPlainTextEmail = (data: EmailRequest): string => {
  const isApproved = data.status === 'APROBADO';
  const statusEmoji = isApproved ? '🎉' : '❌';
  const statusText = isApproved ? 'APROBADA' : 'RECHAZADA';

  return `
${statusEmoji} ${data.universityName} - Solicitud ${statusText}

Estimado/a ${data.studentName},

${isApproved
  ? `¡Tenemos excelentes noticias! Tu solicitud de ingreso al programa de ${data.program} ha sido APROBADA.

¡Bienvenido/a a ${data.universityName}!

Estamos emocionados de tenerte como parte de nuestra comunidad académica. A partir de ahora, tendrás acceso completo a:

- Sistema de inscripción a cursos
- Portal estudiantil completo
- Biblioteca digital
- Campus virtual
- Comunidad estudiantil

Accede a tu dashboard: ${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/dashboard`
  : `Lamentamos informarte que tu solicitud de ingreso al programa de ${data.program} no ha sido aprobada en esta ocasión.

Motivo: ${data.reason || 'Por favor, revisa que todos tus documentos estén completos y sean legibles. Puedes volver a enviar tu solicitud cuando hayas actualizado la información requerida.'}

No te desanimes. Puedes revisar tu solicitud, actualizar la documentación necesaria y volver a aplicar cuando estés listo/a.

Revisar perfil: ${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/profile`
}

Recuerda: Mantén tu información de contacto actualizada para recibir futuras comunicaciones importantes.

---
${data.universityName}
Tu futuro académico comienza aquí

Este es un mensaje automático del sistema. Si tienes preguntas, contacta a nuestro equipo de soporte.
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    // Validate required fields
    if (!emailData.studentEmail || !emailData.studentName || !emailData.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: studentEmail, studentName, status' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailData.studentEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const htmlContent = createApprovalEmailHTML(emailData)
    const textContent = createPlainTextEmail(emailData)

    const isApproved = emailData.status === 'APROBADO'
    const subject = `${isApproved ? '🎉' : '❌'} ${emailData.universityName} - Solicitud ${isApproved ? 'Aprobada' : 'Rechazada'}`

    // Mock email sending (replace with actual email service)
    console.log('📧 Email would be sent:', {
      to: emailData.studentEmail,
      subject,
      preview: `${emailData.studentName}, tu solicitud de ingreso ha sido ${emailData.status.toLowerCase()}`
    })

    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Postmark
    // - Mailgun

    /*
    // Example with Resend:
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${emailData.universityName} <noreply@academianova.com>`,
        to: [emailData.studentEmail],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      throw new Error(`Email service error: ${error}`);
    }
    */

    // Simulate successful email sending
    const mockEmailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data: {
          emailId: mockEmailId,
          recipient: emailData.studentEmail,
          subject: subject,
          sentAt: new Date().toISOString(),
          status: 'delivered'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
