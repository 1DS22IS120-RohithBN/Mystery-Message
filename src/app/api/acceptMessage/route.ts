import { authOptions } from "../auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { User } from "next-auth"

export async function POST(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    
    const user:User=session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,message:"Unauthorized"}, {status:401})
    }
    const userId=user._id
    const {acceptMessage}=await request.json()
    try {
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessage},{new:true})
        if(!updatedUser){
            return Response.json({
                success:false,message:"User not found"}, {status:401})
            
        }
        return Response.json({
            success:true,message:"Message accepted successfully",updatedUser}, {status:200})
    } catch (error) {
        console.log("Failed to update accepting messages status")
        return Response.json({
            success:false,
            message:"Failed to update accepting messages status"
        }, 
    {status:500})

        
    }
}

export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    console.log("accept get message session",session)
    
    const user:User=session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,message:"Unauthorized"}, {status:401})
    }
    const userId=user._id
   try {
     const usermessage=await UserModel.findById(userId)
     if(!usermessage){
         return Response.json({
             success:false,message:"User not found"}, {status:401})
         }
         return Response.json({
             success:true,
             message:"User message accepting status",
             isAcceptingMessage:usermessage.isAcceptingMessage}
             , {status:200})}
     
 
catch (error) {
    console.log("Failed to get user message accepting status")
    return Response.json({
        success:false,
        message:"Failed to get user message accepting status"},
        {status:500})
    
   }}