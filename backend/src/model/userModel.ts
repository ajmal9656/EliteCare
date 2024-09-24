import { Document, model, Schema } from "mongoose";

interface IImage {
    url: string;
    type: string;
}

interface Iuser extends Document {
    userId: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    DOB: Date;
    address: string;
    image: IImage; // Updated type for image
    createdAt: Date;
    lastLogin: Date;
    referral?: string;
    isBlocked: boolean;
}

const userSchema = new Schema<Iuser>({
    userId: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: { 
        type: String,
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    password: {
        type: String, 
        required: true 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    },
    lastLogin: {
        type: Date 
    },
    DOB: {
        type: Date,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    image: {
        
            url: { type: String, default: "" }, // Optional profileUrl
            type: { type: String, default: "" } // Optional type
        
        
    },
    referral: {
        type: String 
    },
    isBlocked: {
        type: Boolean, 
        default: false 
    },
});

const userModel = model<Iuser>("User", userSchema);

export default userModel;
