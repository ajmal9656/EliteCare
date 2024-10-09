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
            
            throw new Error(error.message)
        }
    }
    async getAllSpecialization(){
        try {
            
            const specializations = await specializationModel.find({isListed:true})
    
           
    
            
            return specializations
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
            .populate('department','name').lean() 

        
        

            
      
          return doctors;
        } catch (error: any) {
          console.error("Error getting doctors with specialization:", error.message);
          throw new Error(`Failed to fetch doctors for specialization ${specializationId}: ${error.message}`);
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
              $match: { _id: new mongoose.Types.ObjectId(doctorId) }, // Match the doctor by ID
            },
            {
              $lookup: {
                from: 'appointments', // The name of the appointments collection
                localField: '_id',    // The field from the doctor model
                foreignField: 'docId', // The field in the appointments model
                as: 'appointments',     // The name of the array to store the results
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
                                    input: '$appointments', // Input array to filter
                                    as: 'appointment',      // Variable name for each element
                                    cond: {                 // Condition to filter
                                        $gt: [{ $ifNull: ['$$appointment.review.rating', 0] }, 0] // Access rating
                                    }
                                }
                            },
                            as: 'appointment',
                            in: {
                                review: '$$appointment.review', // Include only the review
                                patientName: '$$appointment.patientNAme' // Include the patient name
                            }
                        }
                    },
                    [] // Set to empty array if reviewData is not true
                ],
                },
              },
            },
          ]);
      
          // If doctor not found, return null
          if (doctor.length === 0) {
            return null;
          }
      console.log("review",doctor[0]);
      
          return doctor[0]; // Return the doctor object along with appointments if any
        } catch (error: any) {
          console.error("Error getting doctor:", error.message);
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
                throw new Error('User not found');
            }
    
           
            user.image.url = imageData.profileUrl.url;
            user.image.type = imageData.profileUrl.type
    
          
            const updatedUser = await user.save();
    
           
            return updatedUser;  
            
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); 
        }
    }
    

    async checkSlotAvailability(doctorId: string, slotId: Slot, date: string, userId: string) {
        try {
            
            
    
           
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
    
            
            throw new Error('Slot not found.');
    
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); 
        }
    }
    async createAppointment(patientData: any) {
        try {
            

           

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
            
       
            const newAppointment = new appointmentModel({
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
                locked:userId
                
            });
    
           
            const savedAppointment = await newAppointment.save();

            setTimeout(async () => {
                                
                newAppointment.locked=null;

                
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
          


            const updatedAppointment= await appointmentModel.findById(appointmentId);
            if(updatedAppointment?.locked==null ){

               
                throw new Error('Session Timed Out')

                
                

            }

            updatedAppointment.paymentStatus = "payment completed";
            

            await updatedAppointment.save();
            

            if(updatedAppointment){
                const SlotUpdation = await doctorSlotsModel.findOne({
                    doctorId:updatedAppointment.docId,
                    date:updatedAppointment.date,
                    
                })

                

                if(SlotUpdation){
                    
                    
                   const matchingSlot = SlotUpdation.slots.find(slot=>new Date(slot.start).getTime() === new Date(updatedAppointment.start).getTime())
                   if(matchingSlot){
                    
                    matchingSlot.availability = false;
                    matchingSlot.bookedBy = updatedAppointment.userId;
                    await SlotUpdation.save();


                    
                   }
                }
                
            }
            
            
            return updatedAppointment;
        } catch (error: any) {
            console.error("Repository error:", error.message);
            throw new Error(error.message); 
        }
    }
    async getAllAppointments(userId:string,status:string){
        try {
            
            
            let appointments =[]

            if(status == "All"){
                appointments = await appointmentModel.find({ userId: userId })
  .populate("docId").lean();

            }else{
               
                
                appointments = await appointmentModel.find({ userId: userId,status:status })
  .populate("docId").lean();
            }
            
            
            
    
           
    
            
            return appointments
        } catch (error: any) {
            console.error("Error getting application:", error.message);
            throw new Error(error.message);
        }
    }

    async cancelAppointment(applicationId: string): Promise<any> {
        try {
          // Find and update the appointment by ID, setting the status to "cancelled"
          const appointment = await appointmentModel.findOneAndUpdate(
            { _id: applicationId },
            { status: "cancelled" },
            { new: true } // Returns the updated document
          );
      
          // If no appointment was found, return a meaningful message
          if (!appointment) {
            throw new Error(`Appointment with ID ${applicationId} not found`);
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
      async addReview(appointmentId: string, rating: number, reviewText: string): Promise<any> {
        try {
          // Find the appointment by its ID and update the review fields (rating and description)
          const updatedAppointment = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId }, // Find appointment by ID
            { 
              $set: { 
                "review.rating": rating, 
                "review.description": reviewText 
              } // Update the review fields
            },
            { new: true } // Return the updated document
          );
      
          // Check if the appointment exists
          if (!updatedAppointment) {
            throw new Error('Appointment not found');
          }
      
          // Return the updated appointment with the review
          return updatedAppointment;
        } catch (error: any) {
          console.error("Error adding review:", error.message);
          throw new Error(error.message);
        }
      }

      async getAppointment(appointmentId: string) {
        try {
            // Fetch the appointment and populate the 'docId' field
            const appointment = await appointmentModel.findById(appointmentId)
                .populate("docId")  // Populate doctor details based on reference
                .lean();
    
            // Check if appointment exists
            if (!appointment) {
                throw new Error(`Appointment with ID ${appointmentId} not found`);
            }
    
            return appointment;  // Return the populated appointment data
    
        } catch (error: any) {
            console.error("Error getting appointment:", error.message); // Log the error
            throw new Error(error.message);  // Re-throw the error for further handling
        }
    }
    
      
      
      
    
    
    
    
    
    
    
      
}
