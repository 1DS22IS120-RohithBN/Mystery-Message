import { Message } from "@/models/User";

export interface APIresponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<Message>
}