import doctorModel from "../model/doctorModel";
import mongoose, { Document, ObjectId } from "mongoose";
import {
  doctorType,
  DoctorData,
  DoctorFiles,
  docDetails,
  TimeSlot,
  doctorImage,
  DoctorResult,
  DoctorSchedule,
  Slot,
  GetAppointmentData,
  AppointmentData,
  GetTransactionData,
  Wallet,
  IDoctor,
  IDashboardStats,
  IMedicalReport,
  
} from "../interface/doctorInterface/doctorInterface";
import doctorApplicationModel from "../model/doctorApplicationModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";
import doctorSlotsModel from "../model/doctorSlotModel";
import moment from "moment-timezone";
import appointmentModel from "../model/AppoinmentModel";
import WalletModel, { ITransaction, IWallet } from "../model/walletModel";
import NotificationModel from "../model/notificationModel";
import { sendAppointmentCancellationNotification } from "../config/socket.ioConfig";

export class doctorRepository {
  async existDoctor(
    email: string,
    phone: string
  ): Promise<{ existEmail: boolean; existPhone: boolean }> {
    try {
      let existEmail = true;
      let existPhone = true;

      const emailExist = await doctorModel.findOne({ email: email });
      if (!emailExist) {
        existEmail = false;
      }

      const phoneExist = await doctorModel.findOne({ phone: phone });
      if (!phoneExist) {
        existPhone = false;
      }

      return { existEmail, existPhone };
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw new Error("Error checking if user exists");
    }
  }

  async createDoctor(doctorData: doctorType): Promise<Document> {
    try {
      const newDoctor = new doctorModel(doctorData);
      return await newDoctor.save();
    } catch (error: any) {
      console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
    }
  }

  async doctorCheck(email: string): Promise<DoctorResult> {
    try {
      const doctorData = await doctorModel.findOne({ email: email });

      if (doctorData) {
        let result: any = doctorData;

        if (doctorData.kycStatus === "rejected") {
          const rejectedData = await RejectDoctorModel.findOne({
            doctorId: doctorData._id,
          });

          if (rejectedData) {
            result.rejectedReason = rejectedData.reason;
          }
        }

       
        

        return result;
      }

      throw new Error("Doctor Doesn't exist");
    } catch (error: any) {
      console.log("rep error");
      throw new Error(error.message);
    }
  }

  async uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<boolean> {
    try {
      const doctorData = await doctorModel.findOneAndUpdate(
        { email: data.email },
        { kycStatus: "submitted" },
        { new: true }
      );
      if (doctorData) {
        const details = {
          doctorId: doctorData._id,
          name: data.name,
          DOB: data.dob,
          department: data.department,
          gender: data.gender,
          image: docDetails.profileUrl,
          fees: data.fees,
          kycDetails: {
            certificateImage: docDetails.certificateUrl,
            qualificationImage: docDetails.qualificationUrl,
            adharFrontImage: docDetails.aadhaarFrontImageUrl,
            adharBackImage: docDetails.aadhaarBackImageUrl,
            adharNumber: data.aadhaarNumber,
          },
        };

        const newDoctorApplication = await doctorApplicationModel.create(
          details
        );

        console.log("upload data controller",newDoctorApplication);

        return true;
      }else{
        return false
      }
    } catch (error: any) {
      console.log("rep error");
      throw new Error(error.message);
    }
  }

  async createSlot(data: TimeSlot): Promise<DoctorSchedule> {
    try {
      const dateStartOfDay = new Date(data.selectedDate);
  
      const updatedDoctorSlot = await doctorSlotsModel.findOneAndUpdate(
        {
          doctorId: data.doctorId,
          date: dateStartOfDay,
        },
        {
          $addToSet: {
            slots: {
              $each: data.selectedSlots.map((slot) => ({
                start: new Date(slot.start),
                end: new Date(slot.end),
              })),
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
  
      if (!updatedDoctorSlot) {
        throw new Error("Failed to create or update slot");
      }
  
      // Transform _id to string if necessary
      const transformedSchedule: DoctorSchedule = {
        ...updatedDoctorSlot.toObject(),
        _id: updatedDoctorSlot._id.toString(), // Convert ObjectId to string
      };
  
      return transformedSchedule;
    } catch (error: any) {
      console.error("Error creating/updating slot:", error);
      throw new Error(error.message);
    }
  }

  async getSlots(date: string, doctorId: string): Promise<Slot[]> {
    try {
      const formattedDate = new Date(date);

      const doctorSlots = await doctorSlotsModel.findOne({
        doctorId: doctorId,
        date: formattedDate,
      });

      if (doctorSlots && doctorSlots.slots) {
        const slotsArray = doctorSlots.slots.map((slot: any) => {
          return {
            start: this.getTime(slot.start),
            end: this.getTime(slot.end),
            availability: slot.availability,
            _id: slot._id,
            date: doctorSlots.date,
            doctorId: doctorSlots.doctorId,
          };
        });

        
        

        return slotsArray;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error("Error retrieving slots:", error.message);
      throw new Error(error.message);
    }
  }

  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  async checkSlots(date: string, doctorId: string, start: string, end: string): Promise<boolean> {
    try {
      const parsedDate = new Date(date);
      const startTime = new Date(start);
      const endTime = new Date(end);

      const slots = await doctorSlotsModel.findOne({
        doctorId: doctorId,
        date: parsedDate,
      });

      if (slots) {
        for (const slot of slots.slots) {
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);

          if (
            slotStart.getTime() === startTime.getTime() &&
            slotEnd.getTime() === endTime.getTime()
          ) {
            return false;
          }
        }

        return true;
      }

      return true;
    } catch (error: any) {
      console.error("Error checking availability slots:", error.message);
      throw new Error(error.message);
    }
  }
  async deleteTimeSlot(date: Date, doctorId: string, slotId: string): Promise<boolean> {
    try {
      const doctorSlots = await doctorSlotsModel.findOne({
        doctorId: doctorId,
        date: date,
      });

      if (doctorSlots) {
        const slotIndex = doctorSlots.slots.findIndex(
          (slot) => slot._id?.toString() === slotId
        );

        if (slotIndex !== -1) {
          doctorSlots.slots.splice(slotIndex, 1);

          await doctorSlots.save();

          return true;
        } else {
          throw new Error("Slot not found.");
        }
      } else {
        throw new Error("No slots found for the given date.");
      }
    } catch (error: any) {
      console.error("Error deleting time slot:", error.message);
      throw new Error(error.message);
    }
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
  async getWalletDetails(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData> {
    try {
        console.log(status, page, limit);
        
        const skip = (page - 1) * limit;  // Skip the items for previous pages
        const query: any = { doctorId };

        // If a specific status is provided, filter by transaction type
        if (status !== "All") {
            query["transactions.transactionType"] = status;
        }

        // Find the wallet document
        const wallet = await WalletModel.findOne(query).lean();

        if (!wallet) {
            return { transactions: [], totalPages: 0, totalCount: 0, balance: 0 ,currentPage: page};
        }

        // Filter transactions based on the status if provided
        let filteredTransactions = wallet.transactions;
        if (status !== "All") {
            filteredTransactions = wallet.transactions.filter(
                (transaction) => transaction.transactionType === status
            );
        }

        // Calculate total count after filtering
        const totalCount = filteredTransactions.length;

        // Paginate the transactions array
        const paginatedTransactions = filteredTransactions.slice(skip, skip + limit);

        // Calculate total pages based on filtered data
        const totalPages = Math.ceil(totalCount / limit);

        // Return the response including wallet balance
        

        return {
            transactions: paginatedTransactions,
            totalCount,  // Total number of transactions (after filtering)
            totalPages,  // Total number of pages
            currentPage: page, // Current page
            balance: wallet.balance, // Add balance from wallet document
        };
    } catch (error: any) {
        console.error("Error getting wallet details:", error.message);
        throw new Error(`Failed to get wallet details: ${error.message}`);
    }
}



async withdrawMoney(doctorId: string, withdrawalAmount: number): Promise<IWallet> {
  try {
    const wallet = await WalletModel.findOne({ doctorId });

    if (!wallet) {
      throw new Error("Wallet not found for the specified doctor.");
    }

    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      throw new Error("A valid withdrawal amount is required.");
    }

    if (wallet.balance < withdrawalAmount) {
      throw new Error("Insufficient balance for withdrawal.");
    }

    wallet.balance -= withdrawalAmount;

    const transactionId =
      "txn_" + Date.now() + Math.floor(Math.random() * 10000);
    const transaction: ITransaction = {
      amount: withdrawalAmount,
      transactionId: transactionId,
      transactionType: "debit",
    };

    wallet.transactions.push(transaction);

    await wallet.save();

    

    return wallet;
  } catch (error: any) {
    console.error("Error processing withdrawal:", error.message);
    throw new Error(error.message);
  }
}


  async getDoctor(doctorId: string, reviewData: any): Promise<IDoctor | null> {
    try {
      

      const isReviewDataPresent = reviewData === "true";
      

      const doctor = await doctorModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(doctorId) },
        },
        {
          $lookup: {
            from: "appointments", // Join appointments
            localField: "_id",
            foreignField: "docId",
            as: "appointments",
          },
        },
        {
          $lookup: {
            from: "specializations", // Name of the departments collection
            localField: "department", // Field in the doctor document
            foreignField: "_id", // Field in the department document
            as: "departmentInfo", // Name of the new array field
          },
        },
        {
          $unwind: {
            // Unwind the departmentInfo array to get a single object
            path: "$departmentInfo",
            preserveNullAndEmptyArrays: true, // Optional: keeps doctors without a department
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            doctorId: 1,
            email: 1,
            fees: 1,
            image: 1,
            DOB: 1,
            phone: 1,
            department: "$departmentInfo.name", // Populate department name
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
                      patientName: "$$appointment.patientName", // Corrected 'patientNAme' to 'patientName'
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

  async updateProfile(
    doctorId: string,
    updateData: { fees: number; DOB: Date; phone: string }
  ): Promise<DoctorResult> {
    try {
      // Find the doctor by ID
      const doctor = await doctorModel.findById(
        new mongoose.Types.ObjectId(doctorId)
      );
      if (!doctor) {
        throw new Error("doctor not found");
      }

      Object.assign(doctor, updateData);

      const updatedDoctor = await doctor.save();

      

      return updatedDoctor;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getAllStatistics(doctorId: string): Promise<IDashboardStats>{
    try {
      // Get wallet details
      const wallet = await WalletModel.findOne({ doctorId });

      // Calculate total revenue from transactions
      const totalRevenue = wallet
        ? wallet.transactions.reduce((acc, transaction) => {
            return transaction.transactionType === "credit"
              ? acc + transaction.amount
              : acc; // Ignore debit amounts
          }, 0)
        : 0;

      // Get current date and calculate the start of 12 months ago
      const currentDate = new Date();
      const startOfLastYear = new Date(currentDate);
      startOfLastYear.setMonth(currentDate.getMonth() - 11); // 11 months back from current month

      // Create an array of months for the last 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(startOfLastYear);
        date.setMonth(startOfLastYear.getMonth() + i);
        return {
          month: date,
          monthStr: `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`,
        };
      });

      // Get monthly revenue from transactions for the past 12 months
      const monthlyRevenue = await WalletModel.aggregate([
        { $match: { doctorId } },
        { $unwind: "$transactions" },
        {
          $match: {
            "transactions.date": {
              $gte: startOfLastYear, // Filter for the last 12 months
              $lte: currentDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$transactions.date" },
            },
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$transactions.transactionType", "credit"] },
                  "$transactions.amount",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } }, // Sort by month
      ]);

      // Create a map of the monthly revenue results for easy access
      const revenueMap = monthlyRevenue.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
      }, {});

      // Prepare the final monthly revenue array including all months
      const monthlyRevenueArray = months.map((month) => ({
        month: month.monthStr,
        totalRevenue: revenueMap[month.monthStr] || 0, // Default to 0 if no revenue
      }));

      // Get total appointments and today's appointments
      const totalAppointments = await appointmentModel.countDocuments({
        docId: doctorId,
      });
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));
      const todaysAppointments = await appointmentModel.countDocuments({
        docId: doctorId,
        date: { $gte: startOfToday, $lte: endOfToday },
      });

      // Get number of unique patients consulted
      const uniquePatients = await appointmentModel.distinct("userId", {
        docId: doctorId,
      });

      

      return {
        totalRevenue,
        monthlyRevenue: monthlyRevenueArray,
        totalAppointments,
        todaysAppointments,
        numberOfPatients: uniquePatients.length,
      };
    } catch (error: any) {
      console.error("Error fetching statistics:", error.message);
      throw new Error(error.message);
    }
  }

  async uploadProfileImage(doctorID: string, imageData: doctorImage): Promise<DoctorResult> {
    try {
      const doctor = await doctorModel.findById(doctorID);

      if (!doctor) {
        throw new Error("doctor not found");
      }

      doctor.image.url = imageData.profileUrl.url;
      doctor.image.type = imageData.profileUrl.type;

      const updatedDoctor = await doctor.save();

      return updatedDoctor;
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
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

  async doctorData(email: string): Promise<any> {
    try {
      console.log("Fetching doctor data for email:", email);
  
      const response: any = await doctorModel.findOne({ email: email }, { password: 0 });
  
      if (response) {
        console.log("Doctor data fetched:", response);
  
        let result: any = response.toObject(); // Convert Mongoose document to plain object if necessary
  
        if (response.kycStatus === "rejected") {
          console.log("Doctor's KYC status is rejected.");
          
          const rejectedData = await RejectDoctorModel.findOne({
            doctorId: response._id,
          });
  
          console.log("Rejected data fetched:", rejectedData);
  
          if (rejectedData) {
            console.log("Rejected reason found:", rejectedData.reason);
            result.rejectedReason = rejectedData.reason;
          } else {
            console.log("No rejected data found for doctor ID:", response._id);
          }
        }
        if(response.kycStatus === "approved"&&response.kycDetails==null){
          console.log("Approveeee");
          
          result.approved = true;

        }
  
        console.log("Final result before return:", result);
        return result;
      }
  
      console.warn(`No doctor found with email: ${email}`);
      throw new Error("No doctor found");
    } catch (error: any) {
      console.error("Error fetching doctor data:", error.message);
      throw new Error(`Failed to fetch doctor data: ${error.message}`);
    }
  }
  
  
}
