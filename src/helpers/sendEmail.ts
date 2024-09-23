// src/helpers/sendEmail.ts
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { APIresponse } from "@/types/APIresponse";

export async function sendVerificationEmail(
    email: string,
    verifyCode: string,
    username: string
): Promise<APIresponse> {
    try {
        console.log("sending email...");
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'rohithbn27@gmail.com',
            subject: 'Verification Email',
            react: VerificationEmail({ username, verifyCode }),
        });

        console.log("sent email");
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending email", emailError);
        return {
            success: false,
            message: "Failed to send email",
        };
    }
}
