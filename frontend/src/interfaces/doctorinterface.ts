
export interface Doctor {
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
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    docStatus:string
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
  

  