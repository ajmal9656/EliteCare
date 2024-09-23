import mongoose, { Types } from "mongoose";

// Define the Slot interface
interface Slot {
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
  doctorId: Types.ObjectId;
  date: Date;
  slots: Slot[];
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
