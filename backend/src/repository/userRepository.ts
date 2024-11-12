import userModel from "../model/userModel";
import { userImage, userType } from "../interface/userInterface/interface";
import { Document } from "mongoose";
import specializationModel from "../model/SpecializationModel";
import doctorModel from "../model/doctorModel";
import mongoose from "mongoose";
import doctorSlotsModel from "../model/doctorSlotModel";
import { Slot } from "../interface/userInterface/interface";
import appointmentModel from "../model/AppoinmentModel";
import { sendAppointmentCancellationNotification, sendAppointmentNotification } from "../config/socket.ioConfig";
import { randomInt } from "crypto";
import NotificationModel from "../model/notificationModel";

const ObjectId = mongoose.Types.ObjectId;

export class userRepository {
  async existUser(
    email: string,
    phone: string
  ): Promise<{ existEmail: boolean; existPhone: boolean }> {
    try {
      let existEmail = true;
      let existPhone = true;

      const emailExist = await userModel.findOne({ email: email });
      if (!emailExist) {
        existEmail = false;
      }

      const phoneExist = await userModel.findOne({ phone: phone });
      if (!phoneExist) {
        existPhone = false;
      }

      return { existEmail, existPhone };
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw new Error("Error checking if user exists");
    }
  }
  async createUser(userData: userType): Promise<Document> {
    try {
      const newUser = new userModel(userData);
      return await newUser.save();
    } catch (error: any) {
      console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
    }
  }
  async userCheck(email: string) {
    try {
      const userData = await userModel.findOne({ email: email });
      if (userData) {
        return userData;
      }
      throw new Error("User Doesn't exist");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllSpecialization() {
    try {
      const specializations = await specializationModel.find({
        isListed: true,
      });

      return specializations;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllDoctorsWithSpecialization(specializationId: string) {
    try {
      const doctors = await doctorModel
        .find(
          { department: new ObjectId(specializationId), isBlocked: false },
          {
            name: 1,
            _id: 1,
            doctorId: 1,
            email: 1,
            department: 1,
            fees: 1,
            image: 1,
          }
        )
        .populate("department", "name")
        .lean();

      return doctors;
    } catch (error: any) {
      console.error(
        "Error getting doctors with specialization:",
        error.message
      );
      throw new Error(
        `Failed to fetch doctors for specialization ${specializationId}: ${error.message}`
      );
    }
  }
  async getDoctor(doctorId: string, reviewData: any) {
    try {
      const isReviewDataPresent = reviewData === "true";

      const doctor = await doctorModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(doctorId) },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "docId",
            as: "appointments",
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            doctorId: 1,
            email: 1,
            department: 1,
            fees: 1,
            image: 1,
            appointments: {
              $cond: [
                { $eq: [isReviewDataPresent, true] },
                {
                  $map: {
                    input: {
                      $filter: {
                        input: "$appointments", // Input array to filter
                        as: "appointment", // Variable name for each element
                        cond: {
                          // Condition to filter
                          $gt: [
                            { $ifNull: ["$$appointment.review.rating", 0] },
                            0,
                          ], // Access rating
                        },
                      },
                    },
                    as: "appointment",
                    in: {
                      review: "$$appointment.review",
                      patientName: "$$appointment.patientNAme",
                    },
                  },
                },
                [], // Set to empty array if reviewData is not true
              ],
            },
          },
        },
      ]);

      if (doctor.length === 0) {
        return null;
      }

      return doctor[0];
    } catch (error: any) {
      console.error("Error getting doctor:", error.message);
      throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
    }
  }

  async getAllSlots(date: Date, doctorId: string) {
    try {
      const doctorSlots = await doctorSlotsModel.findOne({
        doctorId: doctorId,
        date: {
          $eq: date,
        },
      });

      if (!doctorSlots) {
        return [];
      }

      const availableSlots = doctorSlots.slots.filter(
        (slot) => slot.availability
      );

      if (availableSlots.length === 0) {
        return [];
      }

      return availableSlots;
    } catch (error: any) {
      console.error("Error getting slots:", error.message);
      throw new Error(`Failed to fetch slots: ${error.message}`);
    }
  }
  async updateProfile(
    userId: string,
    updateData: { name: string; DOB: Date; address: string }
  ) {
    try {
      // Find the user by ID
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      Object.assign(user, updateData);

      const updatedUser = await user.save();

      return updatedUser;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
  async uploadProfileImage(userID: string, imageData: userImage) {
    try {
      const user = await userModel.findById(userID);

      if (!user) {
        throw new Error("User not found");
      }

      user.image.url = imageData.profileUrl.url;
      user.image.type = imageData.profileUrl.type;

      const updatedUser = await user.save();

      return updatedUser;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }

  async checkSlotAvailability(
    doctorId: string,
    slotId: Slot,
    date: string,
    userId: string
  ) {
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
  async createAppointment(patientData: any) {
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
  async updateAppointment(sessionId: any, appointmentId: any) {
    try {
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { paymentId: sessionId },
        { new: true }
      );

      return updatedAppointment;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
  async confirmAppointmentPayment(appointmentId: string) {
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

      
      console.log("nnnnnnnnnn",updatedAppointment);
      

      return updatedAppointment;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
  async getAllAppointments(userId: string, status: string) {
    try {
      let appointments = [];

      if (status == "All") {
        appointments = await appointmentModel
          .find({ userId: userId })
          .populate("docId")
          .lean();
      } else {
        appointments = await appointmentModel
          .find({ userId: userId, status: status })
          .populate("docId")
          .lean();
      }

      return appointments;
    } catch (error: any) {
      console.error("Error getting application:", error.message);
      throw new Error(error.message);
    }
  }

  async cancelAppointment(appointmentId: string): Promise<any> {
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
      console.error("Error canceling appointment:", error.message);
      throw new Error(error.message);
    }
  }
  async addReview(
    appointmentId: string,
    rating: number,
    reviewText: string
  ): Promise<any> {
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

  async getAppointment(appointmentId: string) {
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
