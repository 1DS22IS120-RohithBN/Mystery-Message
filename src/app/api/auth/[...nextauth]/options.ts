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
                    const user = await UserModel.findOne({
                        $or: [
                          { email: credentials.identifier },
                          { username: credentials.identifier },
                        ],
                      });                   
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
                        console.log("sign in user:",user)
                        return user;
                    
                } catch (error:any) {
                    throw new Error(error)
                    
                }

                  
              },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id; // This should be set from the JWT callback
                session.user.isVerified = token.isVerified; // Ensure the correct spelling
                session.user.isAcceptingMessage = token.isAcceptingMessage // Ensure this property exists in token
                session.user.username = token.username;
            }
            return session;
        },
          async jwt({ token, user }) {
            if (user) {
                // User is defined only at sign-in
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage= user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
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
