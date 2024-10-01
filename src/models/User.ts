import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    _id:string,
    content:string;
    createdAt:Date;
}

export interface User extends Document{
    username: string;
    email:string;
    password: string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];

}


const MessageSchema:Schema<Message>=new Schema({
    _id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },

})

const UserSchema:Schema<User>=new Schema({
    username: {
        type:String,
        required:[true,"Please enter username"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Please enter username"],
        unique:true,
        match:[/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[3,"Should be longer than 3 characters"]
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]}

)

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;