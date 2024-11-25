import mongoose, { ObjectId, Types } from "mongoose";

export type doctorType={
    doctorId:string;
    name:string;
    email:string;
    phone:string;
    password:string;
    createdAt:Date;
    kycStatus:string


}

interface ImageDetails {
  type: string;
  url: string;
  _id?: ObjectId;
}

interface KycDetails {
  certificateImage: ImageDetails;
  qualificationImage: ImageDetails;
  adharFrontImage: ImageDetails;
  adharBackImage: ImageDetails;
  adharNumber: number;
}

export interface DoctorResult {
  kycDetails: KycDetails;
  _id: any;
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  kycStatus: string;
  createdAt: Date;
  isBlocked: boolean;
  __v?: number;
  DOB: Date;
  department: any;
  fees: number;
  gender: string;
  image: ImageDetails;
  rejectedReason?: string; // Optional, in case `kycStatus` is "rejected"
}

export interface IDoctorInformation {
  name: string;
  email: string;
  doctorId: string | ObjectId; // Replace `ObjectId` with the actual type if using a specific library like MongoDB
  phone: string;
  isBlocked: boolean;
  DOB: Date; // Represents the date of birth
  fees: number; // Represents the fees associated with the doctor
  image: {
    type: string; // Specifies the type of image, e.g., "profile image"
    url: string; // URL pointing to the image location
    _id?: string | ObjectId; // Optional field for the image's unique ID
  };
}
export interface IDoctorImageInfo {
  name: string; // The doctor's name
  email: string; // The doctor's email address
  doctorId: string | ObjectId; // The unique identifier for the doctor
  phone: string; // The doctor's phone number
  isBlocked: boolean; // Indicates if the doctor is blocked
  DOB: Date; // The doctor's date of birth
  fees: number; // The doctor's consultation fees
  image: string; // URL of the doctor's profile image
}

export interface Doctor {
    doctorId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    
    
  
  }
  
export interface DoctorState {
    doctorInfo: Doctor | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    
  }

  export interface DoctorData {
    email:string
    name: string;
    gender: string;
    dob: Date;
    department: string;
    fees: number;
    aadhaarNumber: number;
  }
  export interface FileData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: any;
    size: number;
  }
  
  export interface DoctorFiles {
    image?: FileData[];
    aadhaarFrontImage?: FileData[];
    aadhaarBackImage?: FileData[];
    certificateImage?: FileData[];
    qualificationImage?: FileData[];
  }
  export interface docDetails {
    profileUrl: {
      type:string,
      url:string
    };
    aadhaarFrontImageUrl: {
      type:string,
      url:string
    };
    aadhaarBackImageUrl: {
      type:string,
      url:string
    };
    certificateUrl: {
      type:string,
      url:string
    };
    qualificationUrl: {
      type:string,
      url:string
    };

  }

  interface Time{
    start:string,
    end:string
  }

  export interface TimeSlot{
    selectedDate:string,
    selectedSlots:Time[],
    doctorId:string
  }

  export interface AppointmentSlot {
    _id:mongoose.Types.ObjectId
    start: Date;
    end: Date;
    locked: boolean;
    availability: boolean;
    lockedBy: mongoose.Types.ObjectId | null;
    lockExpiration: Date | null;
    bookedBy: mongoose.Types.ObjectId| null;
  }

  export interface doctorImage {
    profileUrl: {
      type:string
      url:string
    };
    

  }

 export interface Slot {
    start: Date|string;
    end: Date|string;
    availability: boolean;
    locked?: boolean;
    lockedBy?: ObjectId | null; // Allowing null for unlocked slots
    lockExpiration?: Date | null; // Allowing null for slots without expiration
    bookedBy?: ObjectId | null; // Allowing null for unbooked slots
    _id: ObjectId;
  }
  
 export interface DoctorSchedule {
  _id: ObjectId | string; // Adjusted to accept both ObjectId and string
  date: Date;
  doctorId: ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  slots: Slot[];
  __v: number;
  }

  interface User {
    _id: ObjectId;
    userId: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    createdAt: Date;
    DOB: Date;
    address: string;
    image: object; // Replace `object` with the actual type if known
    isBlocked: boolean;
    __v: number;
  }
  
  interface Review {
    rating: number;
    description: string;
  }
  
 export interface AppointmentData {
    _id: ObjectId ;
    appointmentId: number;
    userId: User;
    docId: ObjectId;
    patientNAme: string;
    age: number;
    description: string;
    date: Date;
    start: Date;
    end: Date;
    locked: null | boolean;
    status: string;
    fees: number;
    review: Review;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string;
    prescription: string | null;
    reason: string | null;
    medicalRecords: Array<object>; // Replace `object` with the actual type if known
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  


  export interface GetAppointmentData{
    appointments:AppointmentData[];
    totalPages:number;
    currentPage:number;
    totalAppointments:number;



  }

  interface Transaction {
    amount: number;
    transactionId: string;
    transactionType: 'credit' | 'debit';
    appointmentId?: string|any;
    _id?: any;
    date?: Date|any;

  }
  export interface Wallet {
    _id: ObjectId;
    doctorId: string;
    balance: number;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface GetTransactionData{
    transactions:Transaction[];
    totalPages:number;
    currentPage?:number;
    balance:number;
    totalCount:number
    



  }

  interface IReview {
    // Define properties of the review (adjust the properties according to your structure)
    rating: number;
    review: string;
  }
  
  interface IImage {
    type: string;
    url: string;
    _id: Types.ObjectId;
  }
  
  export interface IDoctor {
    _id: Types.ObjectId;
    doctorId: string;
    name: string;
    email: string;
    phone: string;
    DOB: Date;
    fees: number;
    image: IImage;
    department: string;
    appointments: Array<{ review: IReview[] }>;
    signedImageUrl?:string
  }

  interface IRevenueByMonth {
    month: string;
    totalRevenue: number;
  }
  
  export interface IDashboardStats {
    totalRevenue: number;
    monthlyRevenue: IRevenueByMonth[];
    totalAppointments: number;
    todaysAppointments: number;
    numberOfPatients: number;
  }

  export interface IMedicalReport {
    _id: any;
    appointmentId: number;
    userId: ObjectId|any;
    docId: ObjectId|any;
    patientNAme: string;
    age: number;
    description: string;
    date?: Date|any;
    start: Date;
    end: Date;
    locked: any;
    status: string;
    fees: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentId?: string|any;
    prescription?: string|any;
    reason?: string | null|any;
    medicalRecords?: any[]|any; // You can replace `any[]` with a more specific type if known
    createdAt?: Date|any;
    updatedAt?: Date|any;
    __v?: number;
    review?: IReview|any;
  }

  export interface IDoctorInfo {
    name: string;
    email: string;
    doctorId: string | ObjectId; // Replace `ObjectId` with the actual type if using a specific library like MongoDB
    phone: string;
    isBlocked: boolean;
    docStatus: string;
    rejectedReason: string | null|any; // Nullable, as it might not always have a value
  }