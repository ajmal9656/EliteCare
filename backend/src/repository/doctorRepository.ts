import doctorModel from "../model/doctorModel";
import { Document } from "mongoose";
import { doctorType,DoctorData,DoctorFiles,docDetails, TimeSlot } from "../interface/doctorInterface/doctorInterface";
import doctorApplicationModel from "../model/doctorApplicationModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";
import doctorSlotsModel from "../model/doctorSlotModel";
import moment from 'moment-timezone';



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
        
            console.log(doctorData)
            const newDoctor = new doctorModel(doctorData);
            return await newDoctor.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }

    async doctorCheck(email: string) {
        try {
          console.log("login doctorrep");
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
                console.log("doctorrep",details);

                const newDoctorApplication = await doctorApplicationModel.create(details);

                console.log("new",newDoctorApplication)

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
        // Convert the input date string to the start of the day in UTC
        const formattedDate = new Date(date);
        
        // Query the database for doctor slots based on the doctorId and date
        const doctorSlots = await doctorSlotsModel.findOne({
          doctorId: doctorId,
          date: formattedDate // Assuming date field is of type Date in the DB and stored in UTC
        });
        console.log("docarry",doctorSlots)
    
        // Check if any slots were found
        if (doctorSlots && doctorSlots.slots) {
          // Map over each slot, converting start and end times to a readable format
          const slotsArray = doctorSlots.slots.map((slot: any) => {
            return {
              start: moment(slot.start).tz('UTC').format('h:mm A'), // Converts start time to 'h:mm A' format in UTC or your preferred timezone
              end: moment(slot.end).tz('UTC').format('h:mm A'), // Converts end time to 'h:mm A' format in UTC or your preferred timezone
              availability: slot.availability,
              _id:slot._id,
              date:doctorSlots.date,
              doctorId:doctorSlots.doctorId
             
            };
          });
          console.log(slotsArray)
    
          return slotsArray;
        } else {
          return []
        }
      } catch (error: any) {
        console.error("Error retrieving slots:", error.message);
        throw new Error(error.message);
      }
    }
   

    async checkSlots(date: string, doctorId: string, start: string, end: string) {
      try {
        const parsedDate = new Date(date);
        const startTime = new Date(start);
        const endTime = new Date(end);
    
        console.log("date", parsedDate);
        console.log("start", startTime);
        console.log("end", endTime);
        
        // Find the doctor slots for the given date and doctor ID
        const slots = await doctorSlotsModel.findOne({
          doctorId: doctorId,
          date: parsedDate,
        });
    
        if (slots) {
          for (const slot of slots.slots) {
            const slotStart = new Date(slot.start);
            const slotEnd = new Date(slot.end);
    
            // Check if the start and end times exactly match any existing slot
            if (slotStart.getTime() === startTime.getTime() && slotEnd.getTime() === endTime.getTime()) {
              console.log("ssssss")
              return false; // Slot is not available
            }
          }
    
          // If no exact match is found, return true (slot is available)
          return true;
        }
    
        // If no slots exist for that date, return true (available)
        return true;
    
      } catch (error: any) {
        console.error("Error retrieving slots:", error.message);
        throw new Error(error.message);
      }
    }
    async deleteTimeSlot(date: Date, doctorId: string, slotId: string) {
      try {
        console.log("qqqqqqqqqqqqqqq")
        console.log("Ddate:", date);
        console.log("Ddoctor ID:", doctorId);
        console.log("Sslot ID:", slotId);
        // Find the document for the specific doctor and date
        const doctorSlots = await doctorSlotsModel.findOne({
          doctorId: doctorId,
          date: date,
        });
        console.log("aaaa",doctorSlots)
    
        if (doctorSlots) {
          // Check if the slot exists in the slots array
          
          const slotIndex = doctorSlots.slots.findIndex(slot => slot._id?.toString() === slotId);
    
          if (slotIndex !== -1) {
            // Use Mongoose's array manipulation to remove the slot
            doctorSlots.slots.splice(slotIndex, 1); // Remove the slot at the found index
    
            // Save the updated document
            await doctorSlots.save();
    
            return true; // Indicate success
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
    
    
    

    
    
    
   
}
