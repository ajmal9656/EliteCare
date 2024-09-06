import { Document, model, Schema } from "mongoose";

// Define the enum for KYC status
enum KYCStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

interface IDoctor extends Document {
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  DOB: Date;
  department: string;
  gender: string;
  image: string;
  fees: number;
  kycStatus: KYCStatus; // Updated to use the enum
  kycDetails: {
    certificateImage: string;
    qualificationImage: string;
    yearOfExperience: number;
    adharNumber: number;
  };
  createdAt: Date;
  lastLogin: Date;
  isBlocked: boolean;
}

const doctorSchema = new Schema<IDoctor>({
  doctorId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
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
  kycStatus: {
    type: String,
    enum: Object.values(KYCStatus), // Use enum values for validation
    default: KYCStatus.PENDING, // Default value
  },
  kycDetails: {
    certificateImage: {
      type: String,
    },
    qualificationImage: {
      type: String,
    },
    yearOfExperience: {
      type: Number,
    },
    adharNumber: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const doctorModel = model<IDoctor>("Doctor", doctorSchema);

export default doctorModel;
