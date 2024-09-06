import mongoose,{ Document, model, Schema } from "mongoose";

// Define the enum for KYC status
enum KYCStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

interface IDoctorApplication extends Document {
  doctorId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  DOB: Date;
  department: string;
  gender: string;
  image: string;
  fees: number;
  kycDetails: {
    certificateImage: string;
    qualificationImage: string;
    adharFrontImage:string,
    adharBackImage:string,
    adharNumber: string;
  };
  createdAt: Date;
}

const doctorApplicationSchema = new Schema<IDoctorApplication>({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  

  
  DOB: {
    type: Date,
  },
  department: {
    type: String,
  },
  gender: {
    type: String,
  },
  image: {
    type: String,
  },
  fees: {
    type: Number,
  },
  
  kycDetails: {
    certificateImage: {
      type: String,
    },
    qualificationImage: {
      type: String,
    },
    adharFrontImage: {
      type: String,
    },
    adharBackImage: {
      type: String,
    },
    
    adharNumber: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  
});

const doctorApplicationModel = model<IDoctorApplication>("DoctorApplication", doctorApplicationSchema);

export default doctorApplicationModel;
