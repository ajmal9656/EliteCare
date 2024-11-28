import mongoose from "mongoose";
export interface Doctor {
  justApproved: boolean;
  _id:string;
    doctorId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    docStatus:string;
    rejectedReason?:string
    image:any
    
  
  }
export interface DoctorDetails {
    _id:string
    doctorId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    docStatus:string;
    rejectedReason?:string
    
  
  }
  
export interface DoctorState {
    
    doctorInfo: Doctor | null;
    
    loading: boolean;
    error: string | null;
    docStatus:string;
    videoCall:null | any
    showVideoCallDoctor: Boolean;
    roomIdDoctor: string | null;
  }


export interface Specializations {
    _id: number;
    name: string;
    description: string;
    isListed: boolean;
  }

  export interface FileUploadSectionProps {
    id: string;
    label: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error?: string;
    previewUrl?: string | null; 
  }

  export interface DoctorApplication {
    _id: string;
    doctorId: string;
    name: string;
    DOB: Date;
    department: string;
    gender: "Male" | "Female";
    image: string;
    fees: number;
    kycDetails: {
      certificateImage: string;
      qualificationImage: string;
      adharFrontImage: string;
      adharBackImage: string;
      adharNumber: number;
    };
    createdAt: Date;
  }


  interface IImage {
    type: string;
    url: string;
    _id: mongoose.Types.ObjectId;
  }
  interface dept{
    name:string
    _id: mongoose.Types.ObjectId;
  }
  

 
  export interface DoctorDataWithSpecialization {
    appointments: any;
    _id: string;
    doctorId: string;
    name: string;
    email: string;
    department: dept; 
    fees: number;
    image: IImage; 
    signedImageUrl:string
    
   
  }

  export interface UpdateDoctorProfilePayload {
    doctorId: string | undefined;
    DOB: string;
    fees: number; // Adjust this if you want to handle a Date object
    phone: string;
  }

  

  