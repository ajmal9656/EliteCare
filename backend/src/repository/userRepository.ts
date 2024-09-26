import userModel from "../model/userModel";
import { userImage, userType } from "../interface/userInterface/interface";
import { Document } from "mongoose";
import specializationModel from "../model/SpecializationModel";
import doctorModel from "../model/doctorModel";
import mongoose from "mongoose";
import doctorSlotsModel from "../model/doctorSlotModel";
import { Slot } from "../interface/userInterface/interface";
import appointmentModel from "../model/AppoinmentModel";



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
        
            
            const newUser = new userModel(userData);
            return await newUser.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }
    async userCheck(email:string){
        try {
            
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

        
        

            
      
          return doctors;
        } catch (error: any) {
          console.error("Error getting doctors with specialization:", error.message);
          throw new Error(`Failed to fetch doctors for specialization ${specializationId}: ${error.message}`);
        }
      }
    async getDoctor(doctorId: string) {
        try {
            
          const doctor = await doctorModel
            .findById(
              doctorId,
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

        
        

            
      
          return doctor;
        } catch (error: any) {
          console.error("Error getting doctor :", error.message);
          throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
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
            
    
            // Check if slots were found
            if (!doctorSlots) {
                return []
            }
    
            // Filter slots to return only those that are available
            const availableSlots = doctorSlots.slots.filter(slot => slot.availability);
            
    
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
            
            
    
            // Find the doctor's slot information by doctorId and date
            const doctorSlot = await doctorSlotsModel.findOne({
                doctorId: new mongoose.Types.ObjectId(doctorId),
                date: new Date(date)
            });
    
           
    
            if (!doctorSlot) {
                throw new Error('Slot not found or doctor does not exist.');
            }
    
            
            if (doctorSlot.slots) {
                for (const slot of doctorSlot.slots) {
                   
                    if (slot._id && slot._id.equals(new mongoose.Types.ObjectId(slotId._id))) {
                        
    
                        if (!slot.locked) {
                            
                            const currentLocalTime = new Date(); 
                            
                            
                            const lockExpirationLocalTime = new Date(currentLocalTime.getTime() + 5 * 60 * 1000); 
                            
                            const lockExpirationUTC = new Date(lockExpirationLocalTime.getTime() - (currentLocalTime.getTimezoneOffset() * 60000));
    
                            
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
    
            // If no matching slot was found
            throw new Error('Slot not found.');
    
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); // Throw the error to be handled in the service layer
        }
    }
    async createAppointment(patientData: any) {
        try {
            

            console.log()

            const doctorSlot = await doctorSlotsModel.findOne({
                doctorId: new mongoose.Types.ObjectId(patientData.doctor._id as string),
                date: new Date(patientData.date)
            });

            

            if (!doctorSlot) {
                throw new Error('Slot not found or doctor does not exist.');
            }
            

            if (doctorSlot && doctorSlot.slots ) {
                const matchingSlot = doctorSlot.slots.find(slot => slot?._id?.toString() === patientData.slot._id.toString());
                if(matchingSlot){
                    if(matchingSlot.lockedBy==null || matchingSlot.lockedBy.toString()!==patientData.userId ){
                        
                            throw new Error('Session Timed Out')
                       

                    }
                    if(matchingSlot.lockedBy.toString()===patientData.userId){

                        const { patientName, age, description, doctor, slot, date,userId } = patientData;
            
            // Create a new appointment object
            const newAppointment = new appointmentModel({
                userId: userId, // Assuming you have userId in the session
                docId: doctor._id, // Doctor ID from the patientData
                patientNAme: patientName,
                age: age,
                description: description,
                date: new Date(date), // Ensure date is in Date format
                start: new Date(slot.start), // Ensure start time is in Date format
                end: new Date(slot.end), // Ensure end time is in Date format
                status: "pending", // Initial status
                fees: doctor.fees, // Convert fees to string as per your model
                paymentMethod: "stripe", // Assuming payment method is stripe
                paymentStatus: "payment pending", // Initial payment status
                locked:userId
                
            });
    
            // Save the appointment to the database
            const savedAppointment = await newAppointment.save();

            setTimeout(async () => {
                                
                newAppointment.locked=null;

                
                await newAppointment.save();

               
            }, 1 * 60 * 1000);

            
            return savedAppointment; 

                       
                        

                    }

                }
                console.log("Matching Slot:", matchingSlot);
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
            // Find the appointment by ID and update it with the provided data
            const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                appointmentId,  // The ID of the appointment to update
                {paymentId:sessionId},     // The data to update the appointment with
                { new: true }   // This option returns the updated document
            );
            
            return updatedAppointment; // Return the updated appointment
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); // Throw the error to be handled in the service layer
        }
    }
    async confirmAppointmentPayment(appointmentId: string) {
        try {
            // Find the appointment by ID and update it with the provided data


            const updatedAppointment= await appointmentModel.findById(appointmentId);
            if(updatedAppointment?.locked==null ){

                console.log("sbvshbvshbv")
                throw new Error('Session Timed Out')

                
                

            }

            updatedAppointment.paymentStatus = "payment completed";
            

            await updatedAppointment.save()
            
            
            return updatedAppointment; // Return the updated appointment
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); // Throw the error to be handled in the service layer
        }
    }
    
    
    
    
    
    
    
    
      
}
