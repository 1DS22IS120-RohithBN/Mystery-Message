import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions:NextAuthOptions={
    providers:[  
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any, req):Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ email: credentials.identifier.email });
                    if (!user) {
                        throw new Error('Invalid email or password');
                    }
                    if(!user.isVerified){
                        throw new Error("Verify your email")
                    }
                    const isValid = await bcryptjs.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error('Invalid email or password');
                        }
                        return user;
                    
                } catch (error:any) {
                    throw new Error(error)
                    
                }

                  
              },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerfied=token.isVerified
                session.user.isAcceptingMessage=token.isAcceptingMessages
                session.user.username=token.username

            }
            return session
          },
          async jwt({ token, user, }) {
            if(user){
                token._id=user._id?.toString();
                token.isVerfied=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username;
            }
            return token
          }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt',
    },
    secret:process.env.NEXTAUTH_SECRET_KEY,
    
}
