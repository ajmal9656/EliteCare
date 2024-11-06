import mongoose, { Document, Schema, model } from "mongoose";

// Define the message schema with TypeScript types
interface IMessage extends Document {
  sender: "user" | "doctor";
  message: string;
  type: "img" | "txt";
  delete:boolean
}

// Define the chat schema with TypeScript types
interface IChat extends Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  messages: IMessage[];
}

// Create message schema
const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["user", "doctor"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["img", "txt"],
      default: "txt",
    },
    delete:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Create chat schema
const ChatSchema = new Schema<IChat>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// Create the model for the chat schema
const ChatModel = model<IChat>("Chat", ChatSchema);

export default ChatModel;
