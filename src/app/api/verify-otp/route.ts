import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:Request){
    dbConnect();
    try{
    const {username,code}=await request.json();
    const decodedUsername=decodeURIComponent(username)
    const user=await UserModel.findOne({username:decodedUsername})
    if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },{
            status:404
        })
        }
        const verifyValid=user.verifyCode===code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()

        if(verifyValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()
            return Response.json({
                success:true,
                message:"Your Verification successful"
                })
                }
            if(verifyValid && !isCodeNotExpired){
                return Response.json({
                    success:false,
                    message:"Verification code expired"
                    },{
                        status:400
                        })
                        }
            else{
                return Response.json({
                    success:false,
                    message:"Invalid verification code"
                    },{
                        status:400
                        })

            
            }
        }
    catch(error){
        console.log(error);
        return Response.json({
            success:false,
            message:"Invalid, cannot verify"
        },
    {
        status:500
    })
    }
}