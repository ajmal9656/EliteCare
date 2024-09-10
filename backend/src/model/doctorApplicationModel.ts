import mongoose, { Document, model, Schema } from "mongoose";

// Define the enum for KYC status
enum KYCStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Define interfaces for the image objects
interface IImage {
  type: string;
  url: string;
}

interface IKYCDetails {
  certificateImage: IImage;
  qualificationImage: IImage;
  adharFrontImage: IImage;
  adharBackImage: IImage;
  adharNumber: string;
}

interface IDoctorApplication extends Document {
  doctorId: mongoose.Types.ObjectId;
  name: string;
  DOB: Date;
  department: mongoose.Types.ObjectId; // Updated to ObjectId
  gender: string;
  image: IImage;
  fees: number;
  kycDetails: IKYCDetails;
  createdAt: Date;
}

const imageSchema = new Schema<IImage>({
  type: { type: String, required: true },
  url: { type: String, required: true },
});

const kycDetailsSchema = new Schema<IKYCDetails>({
  certificateImage: { type: imageSchema, required: true },
  qualificationImage: { type: imageSchema, required: true },
  adharFrontImage: { type: imageSchema, required: true },
  adharBackImage: { type: imageSchema, required: true },
  adharNumber: { type: String, required: true },
});

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
    type: Schema.Types.ObjectId,  // Updated to reference the Department model
    ref: 'Specialization', // Ensure this matches the Department model name
    required: true,
  },
  gender: {
    type: String,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  fees: {
    type: Number,
  },
  kycDetails: {
    type: kycDetailsSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const doctorApplicationModel = model<IDoctorApplication>("DoctorApplication", doctorApplicationSchema);

export default doctorApplicationModel;
