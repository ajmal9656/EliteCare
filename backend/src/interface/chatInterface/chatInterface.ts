import { ObjectId } from 'mongodb'; // Importing ObjectId if you're using MongoDB

interface Message {
  sender: 'doctor' | 'user'; // Assuming sender can only be 'doctor' or 'patient'
  message: string;
  type: any // Assuming message type can vary
  delete: boolean;
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface chatData {
  _id: ObjectId|any;
  doctorId: ObjectId|any;
  userId: ObjectId|any;
  __v?: number;
  createdAt?: Date;
  messages: Message[]|any;
  updatedAt?: Date;
}



export interface messageDetails {
    senderID: string;
    receiverID: string;
    appointmentId: string;
    name: string;
    message: string;
    sender: 'doctor' | 'user'; // Assuming 'sender' can only be either 'doctor' or 'patient'
    to:string,
    from:string,
    senderId:string,
    messageId:string
  }

  interface UserImage {
    type: string; // Example: 'user profile image'
    url: string;
  }
  
  export interface User {
    _id?: ObjectId|any;
    name: string;
    image: UserImage;
  }
 

  interface DoctorImage {
    type: string; // Example: 'profile image'
    url: string;
    _id?: ObjectId;
  }
  
  export interface Doctor {
    _id?: ObjectId|any;
    name: string;
    image: DoctorImage;
  }
    
  export interface GetChatResult{
    doctor:Doctor;
    user:User;
    chatResult:chatData
    signedDoctorImageUrl?: string, 
    signedUserImageUrl?: string 


  }

  export interface Notification {
    content: string; // Example: "You Missed a video chat from Dr.Binish"
    type: string; // Example: "message"
    appointmentId: ObjectId|any;
    read: boolean;
    _id: ObjectId|any;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface NotificationData {
    _id: ObjectId|any;
    receiverId: ObjectId|any;
    __v?: number; // Optional if it's not always present
    notifications: Notification; // Assuming a single notification object
  }

  export interface Appointment {
    _id: ObjectId|any; // ObjectId serialized as string
    appointmentId: number;
    userId: ObjectId|any; // ObjectId serialized as string
    docId: ObjectId|any;
    patientNAme: string; // Corrected spelling from 'patientNAme'
    age: number;
    description: string;
    date: Date|string; // ISO Date string
    start: Date|string; // ISO Date Date|string
    end: Date|string; // ISO Date string
    locked: any;
    status: "completed" | "pending" | "prescription pending" | "cancelled" | "cancelled by Dr"; // Example possible statuses
    fees: number;
    review?: Review|any; // Optional if review is not always present
    paymentMethod: 'stripe'; // Example possible methods
    paymentStatus: "payment completed" | "payment pending" | "payment failed" | "refunded" | "anonymous"; // Example statuses
    paymentId?: string | null|any; // Optional if null
    prescription?: string | null|any;
    reason?: string | null|any;
    medicalRecords?:any;
    createdAt?: Date|string; // ISO Date string
    updatedAt?: Date|string; // ISO Date string
    __v?: number;
  }
  
  
  
  export interface Review {
    rating: number;
    description: string;
  }