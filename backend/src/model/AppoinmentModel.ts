import mongoose, { Document, Schema, model } from "mongoose";

// Define the interface for the Appointment document
export interface IAppointment extends Document {
  appointmentId:number;
  userId: mongoose.Types.ObjectId;
  docId: mongoose.Types.ObjectId;
  patientNAme:string,
  age:number;
  description:string;
  date: Date;
  start: Date;
  end: Date;
  locked:mongoose.Types.ObjectId | null;
  status: "pending" | "prescription pending" | "completed" | "cancelled" |"cancelled by Dr";
  fees: number;
  paymentMethod: "stripe" ;
  paymentStatus: "payment pending" | "payment completed" | "payment failed" | "refunded" | "anonymous";
  paymentId?: string | null; // Optional since it can be null
  prescription?: string | null; // Optional since it can be null
  review?: {  // Adding the review property
    rating?: number;    // Optional since rating can be undefined
    description?: string; // Optional since description can be undefined
  };
  reason?: string | null; // Optional since it can be null
  medicalRecords?: string[]; // Optional list of medical records
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Appointment model
const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: {
      type: Number,
      
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientNAme:{
      type: String,
      required: true,

    },
    age:{
      type: Number,
      required: true,

    },
    description:{
      type: String,
      required: true,

    },

    date: {
      type: Date,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    locked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    fees: {
      type: Number,
      required: true,
    },
    review:{
      rating:{
        type:Number,
        default:0
      },
      description:{
        type:String,
        default:""

      }

    },
    paymentMethod: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["payment pending", "payment completed", "payment failed", "refunded", "anonymous"],
      default: "payment pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    prescription: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    medicalRecords: [String],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create the model based on the schema and the interface
const appointmentModel = model<IAppointment>("Appointment", AppointmentSchema);

export default appointmentModel;
