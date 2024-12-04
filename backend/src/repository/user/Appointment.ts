
import { BookAppointment, GetAppointments,  } from "../../interface/userInterface/interface";
import mongoose from "mongoose";
import doctorSlotsModel from "../../model/doctorSlotModel";
import { Slot } from "../../interface/userInterface/interface";
import appointmentModel from "../../model/AppoinmentModel";
import { sendAppointmentCancellationNotification } from "../../config/socket.ioConfig";
import NotificationModel from "../../model/notificationModel";
import { IAppointmentRepository } from "../../interface/user/Appointment.repository.interface";



export class AppointmentRepository implements IAppointmentRepository {
  
  
  

  async checkSlotAvailability(
    doctorId: string,
    slotId: Slot,
    date: string,
    userId: string
  ): Promise<boolean>  {
    try {
      const doctorSlot = await doctorSlotsModel.findOne({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        date: new Date(date),
      });

      if (!doctorSlot) {
        throw new Error("Slot not found or doctor does not exist.");
      }

      if (doctorSlot.slots) {
        for (const slot of doctorSlot.slots) {
          if (
            slot._id &&
            slot._id.equals(new mongoose.Types.ObjectId(slotId._id))
          ) {
            if (!slot.locked) {
              console.log("slottt",slot);
              
              const currentLocalTime = new Date();

              const lockExpirationLocalTime = new Date(
                currentLocalTime.getTime() + 5 * 60 * 1000
              );

              const lockExpirationUTC = new Date(
                lockExpirationLocalTime.getTime() -
                  currentLocalTime.getTimezoneOffset() * 60000
              );

              slot.locked = true;
              slot.lockedBy = new mongoose.Types.ObjectId(userId);
              slot.lockExpiration = lockExpirationUTC;

              await doctorSlot.save();

              setTimeout(async () => {
                slot.locked = false;
                slot.lockedBy = null as any;
                slot.lockExpiration = null as any;

                await doctorSlot.save();
              }, 1 * 60 * 1000);

              return true;
            } else {
              console.log("slotttyy",slot);
              return false;
            }
          }
        }
      }

      throw new Error("Slot not found.");
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
  
  async getAllAppointments(userId: string, status: string, page: number = 1, limit: number = 10): Promise<GetAppointments>  {
    try {
        if (!userId) throw new Error("User ID is required to fetch appointments");

        // Define the filter based on status
        const filter = status === "All" ? { userId } : { userId, status };

        // Query appointments with pagination and populate doctor details
        const appointments = await appointmentModel
            .find(filter)
            .populate("docId")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Calculate total pages for pagination
        const totalRecords = await appointmentModel.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        return { appointments, totalPages };
    } catch (error: any) {
        console.error("Error getting appointments:", error.message);
        throw new Error(error.message);
    }
}


  async cancelAppointment(appointmentId: string): Promise<BookAppointment> {
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        { status: "cancelled", paymentStatus: "refunded" },
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
          content: "Your Appointment cancelled successfully",
          type: "appointment cancellation",  // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId:appointmentId
      };
        const doctorNotificationContent = {
          content: "Appointment has been cancelled by patient",
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

      return appointment;
    } catch (error: any) {
      console.error("Error canceling appointmentsss:", error.message);
      throw new Error(error.message);
    }
  }
  async addReview(
    appointmentId: string,
    rating: number,
    reviewText: string
  ): Promise<BookAppointment> {
    try {
      const updatedAppointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        {
          $set: {
            "review.rating": rating,
            "review.description": reviewText,
          },
        },
        { new: true }
      );

      if (!updatedAppointment) {
        throw new Error("Appointment not found");
      }

      return updatedAppointment;
    } catch (error: any) {
      console.error("Error adding review:", error.message);
      throw new Error(error.message);
    }
  }

  async getAppointment(appointmentId: string): Promise<BookAppointment>  {
    try {
      const appointment = await appointmentModel
        .findById(appointmentId)
        .populate("docId")
        .lean();

      if (!appointment) {
        throw new Error(`Appointment with ID ${appointmentId} not found`);
      }

      return appointment;
    } catch (error: any) {
      console.error("Error getting appointment:", error.message);
      throw new Error(error.message);
    }
  }
  

}
