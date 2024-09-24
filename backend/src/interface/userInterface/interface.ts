import mongoose, { Types } from "mongoose";

export type userType={
    userId:string;
    name:string;
    email:string;
    phone:string;
    password:string;
    createdAt:Date


}
export interface User {
    userId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    
  
  }

 
  
  
export interface UserState {
    userInfo: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  }

  export interface FileData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: any;
    size: number;
  }
  
  

  export interface userImage {
    profileUrl: {
      type:string
      url:string
    };
    

  }

  export interface Slot {
    _id: mongoose.Types.ObjectId;  // MongoDB ObjectId
    start: Date;                   // Start time as a Date object
    end: Date;                     // End time as a Date object
    availability: boolean;         // Availability status
    locked: boolean;               // Lock status
    lockedBy: mongoose.Types.ObjectId | null; // ID of the user who locked the slot (null if not locked)
    lockExpiration: Date | null;   // Lock expiration time (null if not locked)
    bookedBy: mongoose.Types.ObjectId | null; // ID of the user who booked the slot (null if not booked)
}
