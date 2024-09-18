import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { APIresponse } from "@/types/APIresponse";

export async function sendVerificationEmail(
    email: string,
    otp:string,
    username:string

):Promise<APIresponse>{
    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({username,otp }),
          });
        


        return {
            success:true,
            message: "Verification email sent successfully",
        }

        
    } catch (emailError) {
        console.error("Error sending email",emailError);
        return {
            success:false,
            message:"Failed to send email"
        }
    }

}