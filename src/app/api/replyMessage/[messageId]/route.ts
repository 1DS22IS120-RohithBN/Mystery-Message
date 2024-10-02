import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();
    const { reply } = await request.json();
    console.log(reply)
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    const messageId = params.messageId;

    try {
        const replyUser = await UserModel.findOne({ username: user?.username });
        if (!replyUser) {
            return new Response(JSON.stringify({ success: false, message: "User not found" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.log("replyUSer",replyUser)

        const messageIndex = replyUser.messages.findIndex((msg: any) => msg._id === messageId);
        console.log("message index:",messageIndex)
        if (messageIndex === -1) {
            return new Response(JSON.stringify({ success: false, message: "Message not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Assuming reply is an array in your message structure
       replyUser.messages[messageIndex].reply=reply
        console.log("replied User:",replyUser)

        await replyUser.save();

        return new Response(JSON.stringify({ success: true, message: "Reply added successfully", messages: replyUser.messages }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Failed to add reply" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
