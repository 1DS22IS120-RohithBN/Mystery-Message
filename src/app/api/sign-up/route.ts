import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendEmail";

// Function to generate a 6-digit OTP securely
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log("Signup Request Body:", reqBody);

    // Check if a verified user with the same username exists
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 409 } // Conflict
      );
    }

    // Check if a user with the same email exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate OTP for verification
    const verifyCode = generateOTP();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          { success: false, message: "Email already taken" },
          { status: 409 } // Conflict
        );
      } else {
        // User exists but is not verified, update password and resend verification
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await existingUserByEmail.save();

        // Send verification email
        await sendVerificationEmail(username, email, verifyCode);

        return NextResponse.json(
          { success: true, message: "Verification email resent" },
          { status: 200 }
        );
      }
    } else {
      // No existing user, create a new one
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: false,
        messages: [],
      });

      const savedUser = await newUser.save();
      console.log(savedUser)

      // Send verification email
      const emailresponse=await sendVerificationEmail(username, email, verifyCode);
      if(!emailresponse){
        return NextResponse.json({
            success: false,
            message: "Failed to send verification email",
            },
            { status: 500 }
            ); 
        }
      

      return NextResponse.json(
        { success: true, message: "User created successfully. Verification email sent." },
        { status: 201 } // Created
      );
    }
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
