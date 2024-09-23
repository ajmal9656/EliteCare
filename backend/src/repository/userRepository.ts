import userModel from "../model/userModel";
import { userType } from "../interface/interface";
import { Document } from "mongoose";
import specializationModel from "../model/SpecializationModel";
import doctorModel from "../model/doctorModel";
import mongoose from "mongoose";
import doctorSlotsModel from "../model/doctorSlotModel";


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
    
    
      
}
