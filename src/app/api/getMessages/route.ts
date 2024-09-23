import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  // Check if the session or user is missing
  if (!session || !session.user) {
    return new Response(JSON.stringify({
      success: false,
      message: "Unauthorized"
    }), { status: 401 });
  }

  const user: User = session.user;
  const userId = new mongoose.Types.ObjectId(user.id);

  try {
    const foundUser = await UserModel.aggregate([
      {
        $match: { _id: userId } // Use _id as ObjectId for MongoDB matching
      },
      {
        $unwind: "$messages"
      },
      {
        $sort: { "messages.createdAt": -1 }
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } }
      }
    ]);

    if (!foundUser || foundUser.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: "User not found"
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      messages: foundUser[0].messages // Accessing the first element of foundUser array
    }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Server Error"
    }), { status: 500 });
  }
}
