import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // Validating with Zod
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log(result);

    if (!result.success) {
        console.error("Validation failed:", result.error.issues);
        return new Response(JSON.stringify(result.error.issues), {
            status: 400,
        });
    } 
    

    const { username } = result.data;

    // Check if the username is already taken by a verified user
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          message: `Username ${username} is already taken by a verified user`,
          success: false,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If the username is unique
    return new Response(
      JSON.stringify({
        message: "Username is unique",
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
