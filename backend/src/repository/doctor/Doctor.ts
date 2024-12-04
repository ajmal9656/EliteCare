import doctorModel from "../../model/doctorModel";
import mongoose from "mongoose";
import { 
  DoctorData,
  docDetails,
  doctorImage,
  DoctorResult,
  GetTransactionData,
  IDoctor,
  IDashboardStats,

  
} from "../../interface/doctorInterface/doctorInterface";
import doctorApplicationModel from "../../model/doctorApplicationModel";
import RejectDoctorModel from "../../model/RejectDoctorSchema";
import appointmentModel from "../../model/AppoinmentModel";
import WalletModel, { ITransaction, IWallet } from "../../model/walletModel";
import { IDoctorRepository } from "../../interface/doctor/Doctor.repository.interface";

export class DoctorRepository implements IDoctorRepository {
  

  async uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<boolean> {
    try {
      console.log("entered upload repo");
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

  

 

  
  async getWalletDetails(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData> {
    try {
        
        
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

  

  async doctorData(email: string): Promise<any> {
    try {
      
  
      const response: any = await doctorModel.findOne({ email: email }, { password: 0 });
  
      if (response) {
       
  
        let result: any = response.toObject(); // Convert Mongoose document to plain object if necessary
  
        if (response.kycStatus === "rejected") {
         
          
          const rejectedData = await RejectDoctorModel.findOne({
            doctorId: response._id,
          });
  
          
  
          if (rejectedData) {
            
            result.rejectedReason = rejectedData.reason;
          } else {
            console.log("No rejected data found for doctor ID:", response._id);
          }
        }
        if(response.kycStatus === "approved"&&response.kycDetails==null){
          
          
          result.approved = true;

        }
  
       
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
