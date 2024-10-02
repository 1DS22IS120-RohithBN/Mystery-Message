import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const messageId = params.messageId; // Get messageId from the params
  console.log("Message ID:", messageId);

  try {
    const replyUser = await UserModel.findOne({ username: user?.username });

    // Log messages to check their structure
    console.log("User messages before deletion:", JSON.stringify(replyUser?.messages, null, 2));

    // Perform the deletion using the string ID
    const updateResult = await UserModel.updateOne(
      { username: user.username },
      { $pull: { messages: { _id: messageId } } } // No need for ObjectId conversion
    );

    console.log("Update result:", updateResult);
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
