import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuración para Ethereal (correos de prueba que no se envían realmente pero se pueden ver)
// En producción, aquí irían los datos de Gmail, SendGrid, Resend, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "your-ethereal-user",
    pass: process.env.EMAIL_PASS || "your-ethereal-pass",
  },
});

export const EmailService = {
  async sendWelcomeEmail(email: string, name: string, token: string) {
    const validationUrl = `${process.env.FRONTEND_URL}/validate-account?token=${token}`;

    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: "Bienvenido a AcademiaNova - Valida tu cuenta",
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
      if (
        !process.env.EMAIL_USER ||
        process.env.EMAIL_USER === "your-ethereal-user"
      ) {
        console.log(
          "📝 Modo desarrollo: Simulando envío de correo de bienvenida a:",
          email,
        );
        console.log("🔗 Enlace de validación:", validationUrl);
        return { messageId: "simulated-id" };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "📧 Correo de bienvenida enviado:",
        nodemailer.getTestMessageUrl(info) || info.messageId,
      );
      return info;
    } catch (error) {
      console.error("❌ Error enviando correo de bienvenida:", error);
      return null;
    }
  },

  async sendApprovalEmail(email: string, name: string) {
    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: "¡Felicidades! Tu solicitud ha sido aprobada",
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
      if (
        !process.env.EMAIL_USER ||
        process.env.EMAIL_USER === "your-ethereal-user"
      ) {
        console.log(
          "📝 Modo desarrollo: Simulando envío de correo de aprobación a:",
          email,
        );
        return { messageId: "simulated-id" };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "📧 Correo de aprobación enviado:",
        nodemailer.getTestMessageUrl(info) || info.messageId,
      );
      return info;
    } catch (error) {
      console.error("❌ Error enviando correo de aprobación:", error);
      return null;
    }
  },

  async sendRejectionEmail(email: string, name: string) {
    const mailOptions = {
      from: `"AcademiaNova" <noreply@academianova.edu>`,
      to: email,
      subject: "Estado de tu solicitud académica",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #ef4444;">Hola, ${name}</h2>
          <p>Lamentamos informarte que tu solicitud académica ha sido <b>RECHAZADA</b> en esta ocasión.</p>
          <p>Esto puede deberse a documentación incompleta o falta de requisitos específicos de la carrera.</p>
          <p>Te invitamos a revisar los requisitos e intentar inscribirte nuevamente en el próximo periodo.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">AcademiaNova - Excelencia Educativa Digital</p>
        </div>
      `,
    };

    try {
      if (
        !process.env.EMAIL_USER ||
        process.env.EMAIL_USER === "your-ethereal-user"
      ) {
        console.log(
          "📝 Modo desarrollo: Simulando envío de correo de rechazo a:",
          email,
        );
        return { messageId: "simulated-id" };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "📧 Correo de rechazo enviado:",
        nodemailer.getTestMessageUrl(info) || info.messageId,
      );
      return info;
    } catch (error) {
      console.error("❌ Error enviando correo de rechazo:", error);
      return null;
    }
  },

  async sendNewsletterSubscriptionEmail(email: string) {
    const mailOptions = {
      from: `"AcademiaNova" <newsletter@academianova.edu>`,
      to: email,
      subject: "¡Bienvenido a nuestro Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9fafb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0;">AcademiaNova</h1>
            <p style="color: #6b7280; font-size: 14px;">Excelencia Educativa Digital</p>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h2 style="color: #1f2937; margin-top: 0;">¡Gracias por suscribirte!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Ya eres parte de nuestra comunidad. A partir de ahora, recibirás las últimas novedades, 
              lanzamientos de nuevas carreras, cursos gratuitos y eventos exclusivos directamente en tu bandeja de entrada.
            </p>
            <div style="margin: 25px 0; padding: 15px; border-left: 4px solid #4f46e5; background-color: #eef2ff;">
              <p style="margin: 0; color: #4338ca; font-weight: bold;">Próximamente:</p>
              <p style="margin: 5px 0 0 0; color: #6366f1; font-size: 14px;">Webinar: El futuro de la IA en la educación superior (15 de Febrero)</p>
            </div>
            <p style="color: #4b5563; font-size: 14px;">
              Si no fuiste tú quien realizó esta suscripción, puedes ignorar este correo o darte de baja en cualquier momento.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2026 AcademiaNova. Todos los derechos reservados.</p>
            <p>Buenos Aires, Argentina</p>
          </div>
        </div>
      `,
    };

    try {
      if (
        !process.env.EMAIL_USER ||
        process.env.EMAIL_USER === "your-ethereal-user"
      ) {
        console.log(
          "📝 Modo desarrollo: Simulando envío de correo de Newsletter a:",
          email,
        );
        return { messageId: "simulated-id" };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "📧 Correo de Newsletter enviado:",
        nodemailer.getTestMessageUrl(info) || info.messageId,
      );
      return info;
    } catch (error) {
      console.error("❌ Error enviando correo de Newsletter:", error);
      return null;
    }
  },

  async sendContactInquiryEmail(data: {
    nombre: string;
    apellido?: string;
    email: string;
    telefono?: string;
    mensaje?: string;
    tipoCarrera?: string;
    modalidad?: string;
    provincia?: string;
    source: "contact_form" | "chatbot";
  }) {
    const isChatbot = data.source === "chatbot";
    const subject = isChatbot
      ? "Nueva consulta desde el Chatbot"
      : "Nueva solicitud de asesor académico";

    const mailOptions = {
      from: `"AcademiaNova System" <system@academianova.edu>`,
      to: "consultas@academianova.edu", // En un caso real, esto iría a una casilla de atención
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            ${subject}
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Nombre:</strong> ${data.nombre} ${data.apellido || ""}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.telefono ? `<p><strong>Teléfono:</strong> ${data.telefono}</p>` : ""}
            ${data.provincia ? `<p><strong>Provincia:</strong> ${data.provincia}</p>` : ""}
            ${data.tipoCarrera ? `<p><strong>Interés:</strong> ${data.tipoCarrera} (${data.modalidad || "No especificada"})</p>` : ""}
            ${
              data.mensaje
                ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p><strong>Mensaje/Consulta:</strong></p>
                <p style="font-style: italic; color: #4b5563;">"${data.mensaje}"</p>
              </div>
            `
                : ""
            }
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
            Este es un correo automático generado por el sistema de ${
              isChatbot ? "Chatbot" : "Contacto Académico"
            }.
          </p>
        </div>
      `,
    };

    try {
      if (
        !process.env.EMAIL_USER ||
        process.env.EMAIL_USER === "your-ethereal-user"
      ) {
        console.log(
          `📝 Modo desarrollo: Simulando envío de consulta (${data.source}) de:`,
          data.email,
        );
        return { messageId: "simulated-id" };
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Consulta de ${data.source} enviada:`, info.messageId);
      return info;
    } catch (error) {
      console.error(`❌ Error enviando consulta de ${data.source}:`, error);
      return null;
    }
  },
};
