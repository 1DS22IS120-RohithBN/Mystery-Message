import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    // Log incoming data
    console.log("Incoming data:", { username, content });

    // Validate content
    if (!content || typeof content !== 'string') {
        console.log("not sstring")
        return Response.json(
            { message: 'Content cannot be empty or invalid', success: false },
            { status: 400 }
        );
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Log the user object
        console.log("User object before saving:", user);

        if(!user.isAcceptingMessage){
            return Response.json({
                message: 'User is not accepting messages',
                success: false,
            })
        }
        
const newMessage={ content:content, createdAt: new Date() };
console.log("type of content", typeof  content);

        console.log("New Message:", { content:content, createdAt: new Date() });

        // Ensure messages is an array
        if (!Array.isArray(user.messages)) {
            user.messages = [];
        }

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
        } else {
            console.error('Other Error:', error);
        }
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
