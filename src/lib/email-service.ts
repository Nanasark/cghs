// This example uses Resend, but you can use any email service
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface KybStatusEmailParams {
  to: string
  subject: string
  status: "approved" | "rejected" | "pending"
  businessName: string
  feedback?: string
}

export async function sendKybStatusEmail({ to, subject, status, businessName, feedback }: KybStatusEmailParams) {
  try {
    const htmlContent = getEmailHtml(status, businessName, feedback)
    const textContent = getEmailText(status, businessName, feedback)

    const { data, error } = await resend.emails.send({
      from: "noreply@resend.dev",
      to,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendKybStatusEmail:", error)
    throw error
  }
}

function getEmailText(status: string, businessName: string, feedback?: string) {
  if (status === "approved") {
    return `
      Dear ${businessName},
      
      We are pleased to inform you that your KYB application has been approved.
      
      ${feedback ? `Additional information: ${feedback}` : ""}
      
      You can now access all features of the cGHS platform.
      
      Thank you for choosing cGHS.
      
      Best regards,
      The cGHS Team
    `
  } else {
    return `
      Dear ${businessName},
      
      We regret to inform you that your KYB application requires some updates before it can be approved.
      
      ${feedback ? `Reason: ${feedback}` : ""}
      
      Please log in to your account to update the required information.
      
      If you have any questions, please contact our support team.
      
      Best regards,
      The cGHS Team
    `
  }
}

function getEmailHtml(status: string, businessName: string, feedback?: string) {
  if (status === "approved") {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">KYB Application Approved</h2>
        <p>Dear ${businessName},</p>
        <p>We are pleased to inform you that your KYB application has been approved.</p>
        ${feedback ? `<p><strong>Additional information:</strong> ${feedback}</p>` : ""}
        <p>You can now access all features of the cGHS platform.</p>
        <p>Thank you for choosing cGHS.</p>
        <p>Best regards,<br>The cGHS Team</p>
      </div>
    `
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">KYB Application Requires Updates</h2>
        <p>Dear ${businessName},</p>
        <p>We regret to inform you that your KYB application requires some updates before it can be approved.</p>
        ${feedback ? `<p><strong>Reason:</strong> ${feedback}</p>` : ""}
        <p>Please log in to your account to update the required information.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The cGHS Team</p>
      </div>
    `
  }
}

