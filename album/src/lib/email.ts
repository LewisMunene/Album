// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendInvitationEmailProps {
    to: string
    inviterName: string
    inviteLink: string
    expiresIn: string
}

export async function sendInvitationEmail({
    to,
    inviterName,
    inviteLink,
    expiresIn,
}: SendInvitationEmailProps) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Muthee Family Album <noreply@yourdomain.com>',
            to: [to],
            subject: "You're invited to the Muthee Family Album",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Album Invitation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDF8F3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDF8F3; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #C4956A, #A67B4F); padding: 40px 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 28px;">❤️</span>
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; font-weight: 600;">
                                Muthee Family Album
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #3D3229; font-size: 22px; margin: 0 0 16px; font-weight: 600;">
                                You're Invited! 🎉
                            </h2>
                            
                            <p style="color: #8B7355; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                                <strong style="color: #3D3229;">${inviterName}</strong> has invited you to join the Muthee Family Album — a private space where our family preserves memories, shares stories, and celebrates our bonds.
                            </p>

                            <p style="color: #8B7355; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                                Click the button below to accept your invitation and create your account:
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${inviteLink}" 
                                           style="display: inline-block; background: linear-gradient(135deg, #C4956A, #A67B4F); color: #FFFFFF; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(196, 149, 106, 0.3);">
                                            Accept Invitation
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #8B7355; font-size: 14px; line-height: 1.6; margin: 32px 0 0; text-align: center;">
                                This invitation expires in <strong>${expiresIn}</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F5EDE4; padding: 24px 30px; text-align: center;">
                            <p style="color: #8B7355; font-size: 13px; margin: 0 0 8px;">
                                If you didn't expect this invitation, you can safely ignore this email.
                            </p>
                            <p style="color: #A69580; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} Muthee Family Album
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Link fallback -->
                <p style="color: #8B7355; font-size: 12px; margin-top: 24px; text-align: center;">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="${inviteLink}" style="color: #C4956A; word-break: break-all;">${inviteLink}</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
            text: `
You're Invited to the Muthee Family Album!

${inviterName} has invited you to join the Muthee Family Album — a private space where our family preserves memories, shares stories, and celebrates our bonds.

Click the link below to accept your invitation and create your account:
${inviteLink}

This invitation expires in ${expiresIn}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Muthee Family Album
            `,
        })

        if (error) {
            console.error('Failed to send invitation email:', error)
            return { success: false, error: error.message }
        }

        return { success: true, messageId: data?.id }
    } catch (error) {
        console.error('Email service error:', error)
        return { success: false, error: 'Failed to send email' }
    }
}