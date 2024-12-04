
import { BookAppointment } from "../../interface/userInterface/interface";
import mongoose from "mongoose";
import doctorSlotsModel from "../../model/doctorSlotModel";
import appointmentModel from "../../model/AppoinmentModel";
import {  sendAppointmentNotification } from "../../config/socket.ioConfig";
import { randomInt } from "crypto";
import NotificationModel from "../../model/notificationModel";
import { IBookingRepository } from "../../interface/user/Booking.repository.interface";



export class BookingRepository implements IBookingRepository {
  
  
  

  
  async createAppointment(patientData: any): Promise<BookAppointment|undefined>  {
    try {
      const doctorSlot = await doctorSlotsModel.findOne({
        doctorId: new mongoose.Types.ObjectId(patientData.doctor._id as string),
        date: new Date(patientData.date),
      });

      if (!doctorSlot) {
        throw new Error("Slot not found or doctor does not exist.");
      }

      const appointmentId = randomInt(100000, 999999).toString();

      if (doctorSlot && doctorSlot.slots) {
        const matchingSlot = doctorSlot.slots.find(
          (slot) => slot?._id?.toString() === patientData.slot._id.toString()
        );
        if (matchingSlot) {
          if (
            matchingSlot.lockedBy == null ||
            matchingSlot.lockedBy.toString() !== patientData.userId
          ) {
            throw new Error("Session Timed Out");
          }
          if (matchingSlot.lockedBy.toString() === patientData.userId) {
            const {
              patientName,
              age,
              description,
              doctor,
              slot,
              date,
              userId,
            } = patientData;

            const newAppointment = new appointmentModel({
              appointmentId: appointmentId,
              userId: userId,
              docId: doctor._id,
              patientNAme: patientName,
              age: age,
              description: description,
              date: new Date(date),
              start: new Date(slot.start),
              end: new Date(slot.end),
              status: "pending",
              fees: doctor.fees,
              paymentMethod: "stripe",
              paymentStatus: "payment pending",
              locked: userId,
            });

            const savedAppointment = await newAppointment.save();

            setTimeout(async () => {
              newAppointment.locked = null;

              await newAppointment.save();
            }, 1 * 60 * 1000);

           

            return savedAppointment;
          }
        }
      } else {
        console.log("No slots found for the doctor on the specified date.");
      }
    } catch (error: any) {
      console.error("Repository errorrrrr:", error.message);
      throw new Error(error.message); // Throw the error to be handled in the service layer
    }
  }
  async updateAppointment(sessionId: any, appointmentId: any): Promise<BookAppointment|null>  {
    try {
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { paymentId: sessionId,
          paymentStatus: "payment completed" },
        { new: true }
      );

      return updatedAppointment;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
  async confirmAppointmentPayment(appointmentId: string): Promise<BookAppointment>  {
    try {
      const updatedAppointment = await appointmentModel.findById(appointmentId);
      if (updatedAppointment?.locked == null) {
        throw new Error("Session Timed Out");
      }

      updatedAppointment.paymentStatus = "payment completed";

      await updatedAppointment.save();

      if (updatedAppointment) {
        const SlotUpdation = await doctorSlotsModel.findOne({
          doctorId: updatedAppointment.docId,
          date: updatedAppointment.date,
        });

        if (SlotUpdation) {
          const matchingSlot = SlotUpdation.slots.find(
            (slot) =>
              new Date(slot.start).getTime() ===
              new Date(updatedAppointment.start).getTime()
          );
          if (matchingSlot) {
            matchingSlot.availability = false;
            matchingSlot.bookedBy = updatedAppointment.userId;
            await SlotUpdation.save();
          }
        }
        const appointmentDetails ={
          recieverID:updatedAppointment.docId,
          sender:"user appointment",
          appointmentId:updatedAppointment._id,
          
        }
        // Create notification content
        const userNotificationContent = {
          content: "Your Appointment booked successfully ",
          type: "appointment booking",  // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId:appointmentId
      };
        const doctorNotificationContent = {
          content: "You got a new Appointment",
          type: "appointment booking",  // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId:appointmentId
      };

      // Find the receiver's notification document, or create a new one if it doesn't exist
      const userNotification = await NotificationModel.findOneAndUpdate(
          { receiverId: new mongoose.Types.ObjectId(updatedAppointment.userId) },
          { $push: { notifications: userNotificationContent } },
          { new: true, upsert: true }  // Creates document if not found
      );
      const doctorNotification = await NotificationModel.findOneAndUpdate(
          { receiverId: new mongoose.Types.ObjectId(updatedAppointment.docId) },
          { $push: { notifications: doctorNotificationContent } },
          { new: true, upsert: true }  // Creates document if not found
      );

      sendAppointmentNotification(updatedAppointment.docId);

        // const updateNotification = await NotificationModel.
      }

      
      
      

      return updatedAppointment;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
 
  

}
