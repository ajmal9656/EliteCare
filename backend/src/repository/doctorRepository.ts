import doctorModel from "../model/doctorModel";
import mongoose, { Document,ObjectId } from "mongoose";
import { doctorType,DoctorData,DoctorFiles,docDetails, TimeSlot, doctorImage } from "../interface/doctorInterface/doctorInterface";
import doctorApplicationModel from "../model/doctorApplicationModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";
import doctorSlotsModel from "../model/doctorSlotModel";
import moment from 'moment-timezone';
import appointmentModel from "../model/AppoinmentModel";
import WalletModel, { ITransaction} from "../model/walletModel";
import { log } from "console";



export class doctorRepository {
    async existDoctor(email: string, phone: string): Promise<{ existEmail: boolean, existPhone: boolean }> {
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
            console.error('Error checking if user exists:', error);
            throw new Error('Error checking if user exists');
        }
    }

    async createDoctor(doctorData:doctorType):Promise<Document>{
        try {
        
            
            const newDoctor = new doctorModel(doctorData);
            return await newDoctor.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }

    async doctorCheck(email: string) {
        try {
          
          const doctorData = await doctorModel.findOne({ email: email });
      
          if (doctorData) {
            let result: any = doctorData; 
      
            if (doctorData.kycStatus === "rejected") {
              const rejectedData = await RejectDoctorModel.findOne({ doctorId: doctorData._id });
      
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
      
    async uploadDoctorData(data:DoctorData,docDetails:docDetails){
        try {
            
            
            const doctorData = await doctorModel.findOneAndUpdate({email:data.email},{kycStatus:"submitted"},{new:true});
            if(doctorData){
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
                

                const newDoctorApplication = await doctorApplicationModel.create(details);

                

                return true

            }

            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
   
    
    async createSlot(data: TimeSlot) {
      try {
        const dateStartOfDay = new Date(data.selectedDate);
        
    
        
        const updatedDoctorSlot = await doctorSlotsModel.findOneAndUpdate(
          {
            doctorId: data.doctorId,
            date: dateStartOfDay, // Find by doctorId and date
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
            new: true,      // Return the updated document
            upsert: true,   // Create a new document if it doesn't exist
          }
        );
    
        return updatedDoctorSlot;
      } catch (error: any) {
        console.error("Error creating/updating slot:", error);
        throw new Error(error.message);
      }
    }
    
    async getSlots(date: string, doctorId: string) {
      try {
        
        const formattedDate = new Date(date);
        
        
        const doctorSlots = await doctorSlotsModel.findOne({
          doctorId: doctorId,
          date: formattedDate 
        });
        

         
    
      
        if (doctorSlots && doctorSlots.slots) {
          
          const slotsArray = doctorSlots.slots.map((slot: any) => {
            return {
              start: this.getTime(slot.start), 
              end: this.getTime(slot.end), 
              availability: slot.availability,
              _id:slot._id,
              date:doctorSlots.date,
              doctorId:doctorSlots.doctorId
             
            };
          });
          

          
    
          return slotsArray;
        } else {
          return []
        }
      } catch (error: any) {
        console.error("Error retrieving slots:", error.message);
        throw new Error(error.message);
      }
    }

     getTime(slot:any){
      return moment(slot).tz('UTC').format('h:mm A')
    }
   

    async checkSlots(date: string, doctorId: string, start: string, end: string) {
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
    
            
            if (slotStart.getTime() === startTime.getTime() && slotEnd.getTime() === endTime.getTime()) {
              
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
    async deleteTimeSlot(date: Date, doctorId: string, slotId: string) {
      try {
        
        
        const doctorSlots = await doctorSlotsModel.findOne({
          doctorId: doctorId,
          date: date,
        });
        
    
        if (doctorSlots) {
          
          
          const slotIndex = doctorSlots.slots.findIndex(slot => slot._id?.toString() === slotId);
    
          if (slotIndex !== -1) {
            
            doctorSlots.slots.splice(slotIndex, 1); 
    
         
            await doctorSlots.save();
    
            return true; 
          } else {
            throw new Error('Slot not found.');
          }
        } else {
          throw new Error('No slots found for the given date.');
        }
      } catch (error: any) {
        console.error("Error deleting time slot:", error.message);
        throw new Error(error.message);
      }
    }

    async getAllAppointments(doctorId: string, status: string) {
      try {
        
        
        let appointments = [];
    
        
        if (status === "All") {
          appointments = await appointmentModel.find({ docId: doctorId }).populate("userId").lean();
        } else {
          
          appointments = await appointmentModel.find({ docId: doctorId, status: status }).populate("userId").lean();
        }
    
        
        
        
        return appointments;
      } catch (error: any) {
        console.error("Error getting appointments:", error.message);
        throw new Error(error.message);
      }
    }

    async cancelAppointment(appointmentId: string,reason:string): Promise<any> {
      try {
        
        const appointment = await appointmentModel.findOneAndUpdate(
          { _id: appointmentId },
          { status: "cancelled by Dr",reason:reason,paymentStatus:"refunded" },
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
              (slot) => new Date(slot.start).getTime() === new Date(appointment.start).getTime()
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
        }
    
        
        return appointment;
      } catch (error: any) {
        console.error("Error canceling appointment:", error.message);
        throw new Error(error.message);
      }
    }
    async completeAppointment(appointmentId: string, prescription: string): Promise<any> {
      try {
       
        const appointment = await appointmentModel.findOneAndUpdate(
          { _id: appointmentId }, 
          { status: "completed", prescription: prescription }, 
          { new: true } 
        );
    
        
        if (!appointment) {
          throw new Error("Appointment not found");
        }
    
       
        let wallet = await WalletModel.findOne({ doctorId: appointment.docId });
    
       
        const transactionId = 'txn_' + Date.now() + Math.floor(Math.random() * 10000);
        const transactionAmount = 0.9 * appointment.fees; 
    
        
        const transaction:ITransaction = {
          amount: transactionAmount,
          transactionId: transactionId,
          transactionType: 'credit',
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
    
        return appointment;
      } catch (error: any) {
        console.error("Error completing appointment:", error.message);
        throw new Error(error.message); // Propagate the error
      }
    }
    async getWalletDetails(doctorId: string, status: string) {
      try {
       
        let wallet;
        console.log("status", status);
        
        if (status === "All") {
          wallet = await WalletModel.findOne({ doctorId:doctorId }).lean();
          console.log('re',wallet);
          
          if(!wallet){
            wallet = { transactions: [] };
          }
        } else {
          
          wallet = await WalletModel.findOne({ doctorId }).lean();
          
          
          if (wallet) {
            wallet.transactions = wallet.transactions.filter(transaction => transaction.transactionType === status);
          } else {
            wallet = { transactions: [] }; 
          }
        }
    
        
        
        
        return wallet;
      } catch (error: any) {
        console.error("Error getting wallet details:", error.message);
        throw new Error(error.message);
      }
    }
    async withdrawMoney(doctorId: string, withdrawalAmount: number) {
      try {
          
          const wallet = await WalletModel.findOne({ doctorId });
  
          if (!wallet) {
              throw new Error('Wallet not found for the specified doctor.');
          }
  
        
          if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
              throw new Error('A valid withdrawal amount is required.');
          }
          if (wallet.balance < withdrawalAmount) {
              throw new Error('Insufficient balance for withdrawal.');
          }
  
         
          wallet.balance -= withdrawalAmount;
  
         
          const transactionId = 'txn_' + Date.now() + Math.floor(Math.random() * 10000);
          const transaction: ITransaction = {
              amount: withdrawalAmount,
              transactionId: transactionId,
              transactionType: 'debit',
              
          };
  
          
          wallet.transactions.push(transaction);
  
          
          await wallet.save();
  
          
          return wallet
      } catch (error: any) {
          console.error("Error processing withdrawal:", error.message);
          throw new Error(error.message);
      }
  }

  async getDoctor(doctorId: string, reviewData: any) {
    try {
        console.log(doctorId);
        console.log(reviewData);

        const isReviewDataPresent = reviewData === "true";
        console.log(isReviewDataPresent);
        
        const doctor = await doctorModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(doctorId) }, 
            },
            {
                $lookup: {
                    from: 'appointments', // Join appointments
                    localField: '_id',    
                    foreignField: 'docId', 
                    as: 'appointments',     
                },
            },
            {
                $lookup: {
                    from: 'specializations', // Name of the departments collection
                    localField: 'department', // Field in the doctor document
                    foreignField: '_id', // Field in the department document
                    as: 'departmentInfo', // Name of the new array field
                },
            },
            {
                $unwind: { // Unwind the departmentInfo array to get a single object
                    path: '$departmentInfo',
                    preserveNullAndEmptyArrays: true // Optional: keeps doctors without a department
                }
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
                    department: '$departmentInfo.name', // Populate department name
                    appointments: {
                        $cond: [
                            { $eq: [isReviewDataPresent, true] },
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$appointments', // Input array to filter
                                            as: 'appointment',      // Variable name for each element
                                            cond: {                 // Condition to filter
                                                $gt: [{ $ifNull: ['$$appointment.review.rating', 0] }, 0] // Access rating
                                            }
                                        }
                                    },
                                    as: 'appointment',
                                    in: {
                                        review: '$$appointment.review', 
                                        patientName: '$$appointment.patientName' // Corrected 'patientNAme' to 'patientName'
                                    }
                                }
                            },
                            [] // Set to empty array if reviewData is not true
                        ],
                    },
                },
            },
        ]);
  
        if (doctor.length === 0) {
            return null;
        }
        
        console.log("review", doctor[0]);
  
        return doctor[0]; 
    } catch (error: any) {
        console.error("Error getting doctor:", error.message);
        throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
    }
}

async updateProfile(doctorId: string, updateData:{ fees: number; DOB: Date; phone: string } ) {
  try {
      // Find the doctor by ID
      const doctor = await doctorModel.findById(new mongoose.Types.ObjectId(doctorId));
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

async getAllStatistics(doctorId: string) {
  try {
    // Get wallet details
    const wallet = await WalletModel.findOne({ doctorId });

    // Calculate total revenue from transactions
    const totalRevenue = wallet
      ? wallet.transactions.reduce((acc, transaction) => {
          return transaction.transactionType === 'credit'
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
        monthStr: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      };
    });

    // Get monthly revenue from transactions for the past 12 months
    const monthlyRevenue = await WalletModel.aggregate([
      { $match: { doctorId } },
      { $unwind: '$transactions' },
      {
        $match: {
          'transactions.date': {
            $gte: startOfLastYear, // Filter for the last 12 months
            $lte: currentDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$transactions.date' }
          },
          total: {
            $sum: {
              $cond: [
                { $eq: ['$transactions.transactionType', 'credit'] },
                '$transactions.amount',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    // Create a map of the monthly revenue results for easy access
    const revenueMap = monthlyRevenue.reduce((acc, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {});

    // Prepare the final monthly revenue array including all months
    const monthlyRevenueArray = months.map(month => ({
      month: month.monthStr,
      totalRevenue: revenueMap[month.monthStr] || 0 // Default to 0 if no revenue
    }));

    // Get total appointments and today's appointments
    const totalAppointments = await appointmentModel.countDocuments({ docId: doctorId });
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const todaysAppointments = await appointmentModel.countDocuments({
      docId: doctorId,
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    // Get number of unique patients consulted
    const uniquePatients = await appointmentModel.distinct('userId', { docId: doctorId });

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

async uploadProfileImage(doctorID: string, imageData: doctorImage) {
  try {
      
      const doctor = await doctorModel.findById(doctorID);
      
      if (!doctor) {
          throw new Error('doctor not found');
      }

     
      doctor.image.url = imageData.profileUrl.url;
      doctor.image.type = imageData.profileUrl.type

    
      const updatedDoctor = await doctor.save();

     
      return updatedDoctor;  
      
  } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message); 
  }
}




  
    
    
    
    
    
    
    
    

    
    
    
   
}
