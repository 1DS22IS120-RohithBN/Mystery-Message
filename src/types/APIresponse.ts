import { Message } from "@/models/User";

export interface APIresponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,
    messages?:Array<Message>
}