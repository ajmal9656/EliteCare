import mongoose, { ObjectId, Types } from "mongoose";

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

export interface Appointment {
  patientName: string;
  age: string;
  description: string;
  date: string; // ISO 8601 date string
  slot: SlotData;
  doctor: Doctor;
  userId: string;
}
interface Review {
  rating: number;
  description: string;
}

export interface BookAppointment {
  appointmentId: number;
  userId?: ObjectId|any;
  docId: ObjectId|any;
  patientNAme: string;
  age: number;
  description: string;
  date: Date|any;
  start: Date|string;
  end: Date|string;
  locked: ObjectId|any;
  status: "pending" | "prescription pending" | "completed" | "cancelled" |"cancelled by Dr";
  fees: number;
  review?: Review|any;
  paymentMethod: "stripe";
  paymentStatus: "payment pending" | "payment completed" | "payment failed" | "refunded" | "anonymous";
  paymentId?: string | null|undefined;
  prescription?: string | null|any;
  reason?: string | null|undefined;
  medicalRecords?: string[]|any;
  _id: ObjectId|any;
  createdAt?: Date|any;
  updatedAt?: Date|any;
  __v?: number|any;
}

interface SlotData {
  start: string; // ISO 8601 date string
  end: string;   // ISO 8601 date string
  availability: boolean;
  locked: boolean;
  lockedBy: string | null;
  lockExpiration: string | null; // ISO 8601 date string or null
  bookedBy: string | null;
  _id: string;
}
export interface ScheduleSlot {
  start: Date; // Start time of the slot
  end: Date; // End time of the slot
  availability: boolean; // Indicates if the slot is available
  locked: boolean; // Indicates if the slot is locked
  lockedBy: string | null; // ID of the user who locked the slot (if any)
  lockExpiration: Date | null; // Expiration time of the lock (if any)
  bookedBy: string | null; // ID of the user who booked the slot (if any)
  _id: ObjectId| any; // Unique identifier for the slot
}

export interface UserProfileDetails {
  _id: string | ObjectId;
  image: {
    url: string;
    type: string;
  };
  signedImageUrl?:string
}

export interface UserProfileData {
  _id: string | ObjectId | any;
  userId: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  createdAt?: string | Date;
  DOB: string | Date;
  address: string;
  isBlocked: boolean;
  image: {
    url: string;
    type: string;
  };
  __v?: number;
  
}

interface Doctor {
  _id: string;
  doctorId: string;
  name: string;
  email: string;
  department: Department;
  fees: number;
  image: Image;
  signedImageUrl: string;
}
export interface Doctors {
  _id: ObjectId;
  doctorId: string;
  name: string;
  email: string;
  department: Department;
  fees: number;
  image: Image;
  
}

export interface GetUserData {
  userInfo: UserProfileData; // Array of doctor objects
  accessToken: string; // Total count of doctors
  refreshToken: string; // Total count of doctors
}
export interface GetDoctorsResponse {
  doctors: Doctors[]; // Array of doctor objects
  totalDoctors: number; // Total count of doctors
}
export interface GetAppointments {
  appointments: BookAppointment[]; // Array of doctor objects
  totalPages: number; // Total count of doctors
}


interface Department {
  _id: ObjectId;
  name: string;
}

interface Image {
  type: string;
  url: string;
  _id: ObjectId;
}

interface AppointmentDoctor {
  review: object; // You can expand this based on the structure of the review
  patientName: string;
}

export interface SingleDoctor {
  _id: ObjectId;
  doctorId: string;
  name: string;
  email: string;
  department: ObjectId; // Assuming department is an ObjectId referencing a department document
  fees: number;
  image: Image;
  appointments?: AppointmentDoctor[];
  signedImageUrl?: string;
}


export interface UserProfile {
  image: {
    url: string;
    type: string;
  };
  _id: ObjectId;
  userId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  DOB: Date;
  address: string;
  isBlocked: boolean;
  
}
export interface MedicalField {
  _id: string; // Assuming _id is of type ObjectId from MongoDB
  name: string; // Name of the medical field
  description: string; // Description of the medical field
  isListed: boolean; // Whether the field is listed
  createdAt: Date; // Creation timestamp
  
}

