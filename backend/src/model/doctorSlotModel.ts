import mongoose, { Types } from "mongoose";

// Define the Slot interface
<<<<<<< HEAD
export interface Slots {
=======
interface Slot {
>>>>>>> 10b7c48f1592b2eaa5cf789c67e0b422e7233e93
  _id:string;
  start: Date;
  end: Date;
  availability: boolean;
  locked: boolean;
  lockedBy: Types.ObjectId | null;
  lockExpiration: Date | null;
  bookedBy: Types.ObjectId | null;
}

// Define the DoctorSlot interface
export interface DoctorSlot {
<<<<<<< HEAD
  
  doctorId: Types.ObjectId;
  date: Date;
  slots: Slots[];
=======
  doctorId: Types.ObjectId;
  date: Date;
  slots: Slot[];
>>>>>>> 10b7c48f1592b2eaa5cf789c67e0b422e7233e93
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the DoctorSlotsSchema
const DoctorSlotsSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
        availability: {
          type: Boolean,
          default: true,
        },
        locked: {
          type: Boolean,
          default: false,
        },
        lockedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        lockExpiration: {
          type: Date,
          default: null,
        },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const doctorSlotsModel = mongoose.model("DoctorSlot", DoctorSlotsSchema);
export default doctorSlotsModel;
