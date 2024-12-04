
import mongoose, {  ObjectId } from "mongoose";
import {
  GetAppointmentData,
  AppointmentData,
  IMedicalReport,
  
} from "../../interface/doctorInterface/doctorInterface";
import doctorSlotsModel from "../../model/doctorSlotModel";
import moment from "moment-timezone";
import appointmentModel from "../../model/AppoinmentModel";
import WalletModel, { ITransaction } from "../../model/walletModel";
import NotificationModel from "../../model/notificationModel";
import { sendAppointmentCancellationNotification } from "../../config/socket.ioConfig";
import { IAppointmentRepository } from "../../interface/doctor/Appointment.repository.interface";

export class AppointmentRepository implements IAppointmentRepository {
 

  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  
  
  

  async getAllAppointments(
    doctorId: string,
    status: string,
    page: number = 1,
    limit: number = 10,
    startDate: Date | null = null,
    endDate: Date | null = null
  ) : Promise<GetAppointmentData>{
    try {
      let query: any = { docId: doctorId };
  
      // Filter by status if provided
      if (status !== "All") {
        query.status = status;
      }
  
      // Adjust startDate and endDate to include the full day range if provided
      if (startDate && endDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0); // Start at 00:00:00 UTC
  
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999); // End at 23:59:59.999 UTC
  
        query.start = { $gte: startOfDay };
        query.end = { $lte: endOfDay };
      }
  
      // Count total appointments for pagination
      const totalAppointments = await appointmentModel.countDocuments(query);
  
      // Calculate total pages
      const totalPages = Math.ceil(totalAppointments / limit);
  
      // Fetch appointments with pagination and date filtering
      const appointments = await appointmentModel
        .find(query)
        .populate("userId")
        .skip((page - 1) * limit) // Skip records for the current page
        .limit(limit)             // Limit to the number of records per page
        .lean();

        

const mappedAppointments: any = appointments.map((appointment) => ({
  ...appointment,
  _id: appointment._id as ObjectId, // Ensure the `_id` is explicitly typed
}));


       

        
  
      return {
        appointments:mappedAppointments,
        totalPages,
        currentPage: page,
        totalAppointments,
      };
    } catch (error: any) {
      console.error("Error getting appointments:", error.message);
      throw new Error(error.message);
    }
  }
  
  


  async cancelAppointment(appointmentId: string, reason: string): Promise<AppointmentData> {
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        {
          status: "cancelled by Dr",
          reason: reason,
          paymentStatus: "refunded",
        },
        { new: true }
      );

      if (!appointment) {
        throw new Error(`Appointment with ID ${appointmentId} not found`);
      }

      if (appointment) {
        const slotUpdation = await doctorSlotsModel.findOne({
          doctorId: appointment.docId,
          date: appointment.date,
        });

        if (slotUpdation) {
          const matchingSlot = slotUpdation.slots.find(
            (slot) =>
              new Date(slot.start).getTime() ===
              new Date(appointment.start).getTime()
          );

          if (matchingSlot) {
            matchingSlot.availability = true;
            matchingSlot.bookedBy = null as any;
            matchingSlot.lockedBy = null as any;
            matchingSlot.locked = false;
            matchingSlot.lockExpiration = null as any;

            await slotUpdation.save();
          }
        }
        
    

        const userNotificationContent = {
          content: "Appointment has been cancelled by doctor",
          type: "appointment cancellation",  // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId:appointmentId
      };
        const doctorNotificationContent = {
          content: "Appointment cancelled successfully",
          type: "appointment cancellation",  // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId:appointmentId
      };

      // Find the receiver's notification document, or create a new one if it doesn't exist
      const userNotification = await NotificationModel.findOneAndUpdate(
          { receiverId: new mongoose.Types.ObjectId(appointment.userId) },
          { $push: { notifications: userNotificationContent } },
          { new: true, upsert: true }  // Creates document if not found
      );
      const doctorNotification = await NotificationModel.findOneAndUpdate(
          { receiverId: new mongoose.Types.ObjectId(appointment.docId) },
          { $push: { notifications: doctorNotificationContent } },
          { new: true, upsert: true }  // Creates document if not found
      );

      sendAppointmentCancellationNotification(appointment.docId,appointment.userId)
      }



      

      const appointmentData: any = {
        _id: appointment._id as mongoose.Types.ObjectId, 
        appointmentId: appointment.appointmentId,
        userId: appointment.userId , 
        docId: appointment.docId as mongoose.Types.ObjectId,
        patientNAme: appointment.patientNAme,
        age: appointment.age,
        description: appointment.description,
        date: appointment.date,
        start: appointment.start,
        end: appointment.end,
        locked: appointment.locked,
        status: appointment.status,
        fees: appointment.fees,
        review: appointment.review,
        paymentMethod: appointment.paymentMethod,
        paymentStatus: appointment.paymentStatus,
        paymentId: appointment.paymentId,
        prescription: appointment.prescription,
        reason: appointment.reason,
        medicalRecords: appointment.medicalRecords,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        __v: appointment.__v,
      };
      

      return appointmentData;
    } catch (error: any) {
      console.error("Error canceling appointment:", error.message);
      throw new Error(error.message);
    }
  }
  async completeAppointment(
    appointmentId: string,
    prescription: string
  ): Promise<AppointmentData> {
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        { status: "completed", prescription: prescription },
        { new: true }
      );

      if (!appointment) {
        throw new Error("Appointment not found");
      }
      const appointmentData: any = {
        _id: appointment._id as mongoose.Types.ObjectId, 
        appointmentId: appointment.appointmentId,
        userId: appointment.userId , 
        docId: appointment.docId as mongoose.Types.ObjectId,
        patientNAme: appointment.patientNAme,
        age: appointment.age,
        description: appointment.description,
        date: appointment.date,
        start: appointment.start,
        end: appointment.end,
        locked: appointment.locked,
        status: appointment.status,
        fees: appointment.fees,
        review: appointment.review,
        paymentMethod: appointment.paymentMethod,
        paymentStatus: appointment.paymentStatus,
        paymentId: appointment.paymentId,
        prescription: appointment.prescription,
        reason: appointment.reason,
        medicalRecords: appointment.medicalRecords,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        __v: appointment.__v,
      };

      let wallet = await WalletModel.findOne({ doctorId: appointment.docId });

      const transactionId =
        "txn_" + Date.now() + Math.floor(Math.random() * 10000);
      const transactionAmount = 0.9 * appointment.fees;

      const transaction: ITransaction = {
        amount: transactionAmount,
        transactionId: transactionId,
        transactionType: "credit",
        appointmentId: appointmentId,
      };

      if (wallet) {
        wallet.transactions.push(transaction);
        wallet.balance += transactionAmount;
        await wallet.save();
      } else {
        wallet = new WalletModel({
          doctorId: appointment.docId,
          balance: transactionAmount,
          transactions: [transaction],
        });
        await wallet.save();
      }

      return appointmentData;
    } catch (error: any) {
      console.error("Error completing appointment:", error.message);
      throw new Error(error.message); // Propagate the error
    }
  }
  


  

  async getMedicalRecords(userId: string): Promise<IMedicalReport[]> {
    try {
      // Query appointments where the userId matches and prescription is not null
      const medicalRecords = await appointmentModel.find({
        userId: userId,
        prescription: { $ne: null }, // Filters appointments where prescription is not null
      });

     
      

      return medicalRecords;
    } catch (error: any) {
      console.error("Error getting medical records:", error.message);
      throw new Error(
        `Failed to fetch medical records for user ${userId}: ${error.message}`
      );
    }
  }

  
  
  
}
