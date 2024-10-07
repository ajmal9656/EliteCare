import doctorModel from "../model/doctorModel";
import { Document,ObjectId } from "mongoose";
import { doctorType,DoctorData,DoctorFiles,docDetails, TimeSlot } from "../interface/doctorInterface/doctorInterface";
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
    
        // Query all appointments if status is 'All'
        if (status === "All") {
          appointments = await appointmentModel.find({ docId: doctorId }).populate("userId").lean();
        } else {
          
          appointments = await appointmentModel.find({ docId: doctorId, status: status }).populate("userId").lean();
        }
    
        
        
        // Return the appointments
        return appointments;
      } catch (error: any) {
        console.error("Error getting appointments:", error.message);
        throw new Error(error.message);
      }
    }

    async cancelAppointment(appointmentId: string,reason:string): Promise<any> {
      try {
        // Find and update the appointment by ID, setting the status to "cancelled"
        const appointment = await appointmentModel.findOneAndUpdate(
          { _id: appointmentId },
          { status: "cancelled by Dr",reason:reason },
          { new: true } // Returns the updated document
        );
    
        // If no appointment was found, return a meaningful message
        if (!appointment) {
          throw new Error(`Appointment with ID ${appointmentId} not found`);
        }
    
        if (appointment) {
          const slotUpdation = await doctorSlotsModel.findOne({
            doctorId: appointment.docId,
            date: appointment.date,
          });
    
          
    
          if (slotUpdation) {
            
    
            // Find the matching slot
            const matchingSlot = slotUpdation.slots.find(
              (slot) => new Date(slot.start).getTime() === new Date(appointment.start).getTime()
            );
    
            if (matchingSlot) {
              
    
              // Update slot availability and clear booking details
              matchingSlot.availability = true;
              matchingSlot.bookedBy = null as any; // To handle null assignment
              matchingSlot.lockedBy = null as any; // To handle null assignment
              matchingSlot.locked = false;
              matchingSlot.lockExpiration = null as any; // To handle null assignment
    
              await slotUpdation.save();
             
            }
          }
        }
    
        // Return the updated appointment
        return appointment;
      } catch (error: any) {
        console.error("Error canceling appointment:", error.message);
        throw new Error(error.message);
      }
    }
    async completeAppointment(appointmentId: string, prescription: string): Promise<any> {
      try {
        // Find the appointment by ID and update its status to "completed" and add the prescription
        const appointment = await appointmentModel.findOneAndUpdate(
          { _id: appointmentId }, // Match the appointment ID
          { status: "completed", prescription: prescription }, // Update status and prescription
          { new: true } // Return the updated document
        );
    
        // If the appointment was not found, throw an error
        if (!appointment) {
          throw new Error("Appointment not found");
        }
    
        // Find the doctor's wallet
        let wallet = await WalletModel.findOne({ doctorId: appointment.docId });
    
        // Generate a unique transaction ID
        const transactionId = 'txn_' + Date.now() + Math.floor(Math.random() * 10000);
        const transactionAmount = 0.9 * appointment.fees; // 90% of the appointment fee
    
        // Create the transaction object
        const transaction:ITransaction = {
          amount: transactionAmount,
          transactionId: transactionId,
          transactionType: 'credit', // Assuming it's a credit transaction
          appointmentId: appointmentId,
        };
    
        // If the wallet exists, update it; otherwise, create a new one
        if (wallet) {
          // Add the transaction to the wallet and update the balance
          wallet.transactions.push(transaction);
          wallet.balance += transactionAmount;
          await wallet.save();
        } else {
          // Create a new wallet for the doctor
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
        // Query all wallet transactions if status is 'All'
        let wallet;
        console.log("status", status);
        
        if (status === "All") {
          wallet = await WalletModel.findOne({ doctorId:doctorId }).lean();
          console.log('re',wallet);
          
          if(!wallet){
            wallet = { transactions: [] };
          }
        } else {
          // Get wallet first and then filter transactions by type
          wallet = await WalletModel.findOne({ doctorId }).lean();
          
          // If the wallet exists, filter the transactions
          if (wallet) {
            wallet.transactions = wallet.transactions.filter(transaction => transaction.transactionType === status);
          } else {
            wallet = { transactions: [] }; // Return an empty transactions array if no wallet is found
          }
        }
    
        // Return the wallet transactions
        
        
        return wallet;
      } catch (error: any) {
        console.error("Error getting wallet details:", error.message);
        throw new Error(error.message);
      }
    }
    async withdrawMoney(doctorId: string, withdrawalAmount: number) {
      try {
          // Step 1: Fetch the doctor's wallet details from the database
          const wallet = await WalletModel.findOne({ doctorId });
  
          if (!wallet) {
              throw new Error('Wallet not found for the specified doctor.');
          }
  
          // Step 2: Check if the withdrawal amount is valid
          if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
              throw new Error('A valid withdrawal amount is required.');
          }
          if (wallet.balance < withdrawalAmount) {
              throw new Error('Insufficient balance for withdrawal.');
          }
  
          // Step 3: Deduct the withdrawal amount from the wallet
          wallet.balance -= withdrawalAmount;
  
          // Step 4: Create the transaction object
          const transactionId = 'txn_' + Date.now() + Math.floor(Math.random() * 10000);
          const transaction: ITransaction = {
              amount: withdrawalAmount,
              transactionId: transactionId,
              transactionType: 'debit',
              
          };
  
          // Step 5: Push the transaction to the wallet's transactions array
          wallet.transactions.push(transaction);
  
          // Step 6: Save the updated wallet back to the database
          await wallet.save();
  
          // Step 7: Return the updated wallet details (new balance) and transaction details
          return wallet
      } catch (error: any) {
          console.error("Error processing withdrawal:", error.message);
          throw new Error(error.message);
      }
  }
  
    
    
    
    
    
    
    
    

    
    
    
   
}
