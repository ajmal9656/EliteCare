import { ObjectId } from "mongoose";

export type adminType={
   
    email:string;
    
    password:string;
   


}

export interface Admin {
    
  
    email: string;

    
  
  }
  export interface AdminDetails {
    _id: ObjectId|any;
    email: string;
    password: string;
  }

  export interface Specialization {
    _id: ObjectId|any;
    name: string;
    description: string;
    isListed: boolean;
    createdAt: Date;
    __v?: number;
  }

  export interface getSpecialization {
    specializations: Specialization[];
    totalPages: number;
    totalCount: number;
    page: number;
    
  }
  
export interface AdminState {
    adminInfo: Admin | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  }

  export interface MonthlyStats {
    users: number;         // Number of registered users in the month
    doctors: number;       // Number of registered doctors in the month
    revenue: number;       // Total revenue for the month
    totalFees: number;     // Total fees collected for completed appointments
    doctorRevenue: number; // Revenue credited to doctors
    adminRevenue: number;
    

}
  export interface MonthlyDashboardStats {
    totalUsers: number;         // Number of registered users in the month
    totalDoctors: number;       // Number of registered doctors in the month     
   totalRevenue: number; // Revenue credited to doctors
   doctorRevenue: number; // Revenue credited to doctors
    adminRevenue: number;
    activeDoctors:number;
    activeUsers:number; // Revenue credited to admin
    userDoctorChartData:MonthlyReport[]

}
export interface MonthlyReport {
  year: number;
  month: number;
  users: number;
  doctors: number;
  revenue: number;
  totalFees: number;
  doctorRevenue: number;
  adminRevenue: number;
}

export interface DoctorImage {
  type: string;
  url: string;
  _id?: ObjectId|any;
}

export interface KycDetails {
  certificateImage: IImage; // Replace `IImage` with a more specific type if the structure of these IImages is known
  qualificationImage: IImage;
  adharFrontImage: IImage;
  adharBackImage: IImage;
  adharNumber: string|any;
  _id?: ObjectId|any;
}
interface IImage {
  type: string;
  url: string;
}

export interface Application {
  _id: ObjectId|any;
  doctorId: ObjectId|any;
  name: string;
  DOB: Date;
  department: ObjectId|any;
  gender: string;
  image: DoctorImage;
  fees: number;
  kycDetails: KycDetails;
  createdAt: Date;
  __v?: number;
}

export interface GetApplication{
  applications:Application[],
  totalPages:number


}



export interface User {
  _id: ObjectId|any;
  userId: string; // Assuming `userId` is a string (UUID in this case)
  name: string;
  email: string;
  phone: string;
  password: string; // Hash of the password
  createdAt: Date;
  DOB: Date;
  address: string;
  isBlocked: boolean;
  image:IImage;
  __v?: number;
}
export interface GetUser{
  users:User[],
  totalPages:number


}

export interface Doctor {
  _id: ObjectId|any;
  doctorId: string; // Assuming UUID for doctorId
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  kycStatus: string; // e.g. 'approved'
  createdAt: Date;
  isBlocked: boolean;
  DOB: Date;
  department: ObjectId|any;
  fees: number;
  gender: string;
  image: DoctorImage;
  kycDetails: KycDetails;
  __v?: number;
}

export interface GetDoctor{
  doctors:Doctor[],
  totalPages:number,
  totalCount:number



  
}
export interface Appointment {
  _id: ObjectId|any; // ObjectId serialized as string
  appointmentId: number;
  userId: ObjectId|any; // ObjectId serialized as string
  docId: Doctor|any;
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

export interface getAppointments{
  appointments:Appointment[];
  totalPages:number;
  
}
export interface getTransaction{
  appointments:Appointment[];
  totalPages:number;
  currentPage:number
}