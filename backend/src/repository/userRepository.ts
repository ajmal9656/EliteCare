import userModel from "../model/userModel";
import { userImage, userType } from "../interface/userInterface/interface";
import { Document } from "mongoose";
import specializationModel from "../model/SpecializationModel";
import doctorModel from "../model/doctorModel";
import mongoose from "mongoose";
import doctorSlotsModel from "../model/doctorSlotModel";
import { Slot } from "../interface/userInterface/interface";



const ObjectId = mongoose.Types.ObjectId;




export class userRepository {
    async existUser(email: string, phone: string): Promise<{ existEmail: boolean, existPhone: boolean }> {
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
            console.error('Error checking if user exists:', error);
            throw new Error('Error checking if user exists');
        }
    }
    async createUser(userData:userType):Promise<Document>{
        try {
        
            console.log(userData)
            const newUser = new userModel(userData);
            return await newUser.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }
    async userCheck(email:string){
        try {
            console.log("login userrep");
            const userData = await userModel.findOne({email:email})
            if(userData){
                return userData
            }
            throw new Error("User Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
    async getAllSpecialization(){
        try {
            
            const specializations = await specializationModel.find({isListed:true})
    
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllDoctorsWithSpecialization(specializationId: string) {
        try {
            console.log(specializationId)
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
            .populate('department','name').lean() 

        console.log(specializationId, "dd");
        

            
      
          return doctors;
        } catch (error: any) {
          console.error("Error getting doctors with specialization:", error.message);
          throw new Error(`Failed to fetch doctors for specialization ${specializationId}: ${error.message}`);
        }
      }
      async getAllSlots(date: Date, doctorId: string) {
        try {
            // Find the doctor slots for the specified date and doctor ID
            const doctorSlots = await doctorSlotsModel.findOne({
                doctorId: doctorId,
                date: {
                    $eq: date, // Match the exact date
                },
            })
            console.log("adcslots",doctorSlots)
    
            // Check if slots were found
            if (!doctorSlots) {
                return []
            }
    
            // Filter slots to return only those that are available
            const availableSlots = doctorSlots.slots.filter(slot => slot.availability);
            console.log("availableSlots",availableSlots)
    
            // Check if there are available slots
            if (availableSlots.length === 0) {
                return []
            }
    
            // Return the available slots
            return availableSlots;
        } catch (error: any) {
            console.error("Error getting slots:", error.message);
            throw new Error(`Failed to fetch slots: ${error.message}`);
        }
    }
      async updateProfile(userId: string, updateData:{ name: string; DOB: Date; address: string } ) {
        try {
            // Find the user by ID
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
    
            // Update user fields
            Object.assign(user, updateData); // Update with the new data
    
            // Save the updated user back to the database
            const updatedUser = await user.save();
    
            // Return the updated user data
            return updatedUser;
        } catch (error: any) {
            console.error("Error updating profile:", error.message);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }
    async uploadProfileImage(userID: string, imageData: userImage) {
        try {
            // Find the user by userID
            const user = await userModel.findById(userID);
            
            if (!user) {
                throw new Error('User not found');
            }
    
            // Update the user's profile image data
            user.image.url = imageData.profileUrl.url;
            user.image.type = imageData.profileUrl.type
    
            // Save the updated user document
            const updatedUser = await user.save();
    
            // Optionally, return the updated user data or a success message
            return updatedUser;  // or return { message: 'Profile image updated successfully' };
            
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message);  // Throw the error to be handled in the service layer
        }
    }
    

    async checkSlotAvailability(doctorId: string, slotId: Slot, date: string, userId: string) {
        try {
            console.log("Doctor ID:", doctorId);
            console.log("Date:", new Date(date));
            console.log("Slot ID:", slotId);
            const slotID = slotId._id;
    
            // Find the doctor's slot information by doctorId and date
            const doctorSlot = await doctorSlotsModel.findOne({
                doctorId: new mongoose.Types.ObjectId(doctorId),
                date: new Date(date)
            });
    
            console.log("Doctor Slot:", doctorSlot);
    
            if (!doctorSlot) {
                throw new Error('Slot not found or doctor does not exist.');
            }
    
            // Check if the slots exist
            if (doctorSlot.slots) {
                for (const slot of doctorSlot.slots) {
                    // Ensure slot._id exists before using it
                    if (slot._id && slot._id.equals(new mongoose.Types.ObjectId(slotId._id))) {
                        console.log("Found Slot:", slot);
    
                        if (!slot.locked) {
                            // Get the current local time (in IST)
                            const currentLocalTime = new Date(); // This gives the current local time
                            
    
                            // Add 5 minutes to the local time
                            const lockExpirationLocalTime = new Date(currentLocalTime.getTime() + 5 * 60 * 1000); // 5 minutes later
                            
    
                            // Convert local time (IST) to UTC before storing
                            const lockExpirationUTC = new Date(lockExpirationLocalTime.getTime() - (currentLocalTime.getTimezoneOffset() * 60000));
                           
    
                            // Update the slot with locked status, lockedBy userId, and lock expiration
                            slot.locked = true;
                            slot.lockedBy = new mongoose.Types.ObjectId(userId);
                            slot.lockExpiration = lockExpirationUTC; // Save the expiration in UTC
    
                            // Save the updated doctorSlot document
                            await doctorSlot.save();
    
                            console.log(`Slot locked by user ${userId} until ${lockExpirationLocalTime} (Local Time)`);
                            return true; // Slot locked successfully
                        } else {
                            console.log("Slot is already locked.");
                            return false; // Slot is already locked
                        }
                    }
                }
            }
    
            // If no matching slot was found
            throw new Error('Slot not found.');
    
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); // Throw the error to be handled in the service layer
        }
    }
    
    
    
    
    
    
      
}
