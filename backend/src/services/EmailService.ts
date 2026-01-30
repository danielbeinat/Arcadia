import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para Ethereal (correos de prueba que no se envían realmente pero se pueden ver)
// En producción, aquí irían los datos de Gmail, SendGrid, Resend, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your-ethereal-user',
    pass: process.env.EMAIL_PASS || 'your-ethereal-pass',
  },
});

export const EmailService = {
  async sendWelcomeEmail(email: string, name: string, token: string) {
    const validationUrl = `${process.env.FRONTEND_URL}/validate-account?token=${token}`;
    
    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: 'Bienvenido a AcademiaNova - Valida tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #4f46e5;">¡Hola, ${name}!</h2>
          <p>Gracias por inscribirte en AcademiaNova. Tu solicitud ha sido recibida con éxito.</p>
          <p>Para completar tu registro y poder acceder a la plataforma en modo aspirante, por favor valida tu cuenta haciendo clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${validationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Validar mi cuenta</a>
          </div>
          <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #6b7280;">${validationUrl}</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">Tu solicitud está actualmente en estado <b>PENDIENTE</b> de revisión académica.</p>
        </div>
      `,
    };

    try {
      // Solo intentamos enviar si las credenciales no son las por defecto o estamos en producción
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-ethereal-user') {
        console.log('📝 Modo desarrollo: Simulando envío de correo de bienvenida a:', email);
        console.log('🔗 Enlace de validación:', validationUrl);
        return { messageId: 'simulated-id' };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Correo de bienvenida enviado:', nodemailer.getTestMessageUrl(info) || info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error enviando correo de bienvenida:', error);
      // No relanzamos el error para que no bloquee el flujo principal
      return null;
    }
  },

  async sendApprovalEmail(email: string, name: string) {
    const loginUrl = `${process.env.FRONTEND_URL}/login`;
    
    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: '¡Felicidades! Tu solicitud ha sido aprobada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #10b981;">¡Excelentes noticias, ${name}!</h2>
          <p>Tu solicitud académica ha sido revisada y <b>APROBADA</b>.</p>
          <p>Ya puedes acceder a todos tus cursos y contenidos en la plataforma.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Entrar a la plataforma</a>
          </div>
          <p>¡Te deseamos mucho éxito en tu camino académico!</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">AcademiaNova - Excelencia Educativa Digital</p>
        </div>
      `,
    };

    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-ethereal-user') {
        console.log('📝 Modo desarrollo: Simulando envío de correo de aprobación a:', email);
        return { messageId: 'simulated-id' };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Correo de aprobación enviado:', nodemailer.getTestMessageUrl(info) || info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error enviando correo de aprobación:', error);
      return null;
    }
  },

  async sendRejectionEmail(email: string, name: string) {
    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: 'Actualización sobre tu solicitud en AcademiaNova',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #ef4444;">Hola, ${name}</h2>
          <p>Lamentamos informarte que tu solicitud académica ha sido <b>RECHAZADA</b> en esta ocasión.</p>
          <p>Esto puede deberse a que la información proporcionada no cumple con los requisitos mínimos o está incompleta.</p>
          <p>Si crees que esto es un error, puedes ponerte en contacto con soporte técnico respondiendo a este correo.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">AcademiaNova - Excelencia Educativa Digital</p>
        </div>
      `,
    };

    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-ethereal-user') {
        console.log('📝 Modo desarrollo: Simulando envío de correo de rechazo a:', email);
        return { messageId: 'simulated-id' };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Correo de rechazo enviado:', nodemailer.getTestMessageUrl(info) || info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error enviando correo de rechazo:', error);
      return null;
    }
  }
};
