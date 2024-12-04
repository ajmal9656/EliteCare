
import { ISlotRepository } from "../../interface/doctor/Slot.repository.interface";
import {
  
  Slot,
 
  
} from "../../interface/doctorInterface/doctorInterface";

import doctorSlotsModel from "../../model/doctorSlotModel";
import moment from "moment-timezone";


export class SlotRepository implements ISlotRepository {
 

  async createSlot(data: any): Promise<any> {
    try {
      console.log("Received slot data:", data.selectedSlots[0]);
      console.log("Received slot data:", data.selectedSlots[1]);
  
      const { startDate, endDate, selectedSlots, doctorId } = data;
  
      for (let i = 0; i < selectedSlots.length; i++) {
        const slotDate = moment(startDate).add(i, 'days').toISOString(); // Calculate the date for each slot
        
        const slots = selectedSlots[i].slots.map((slot: any) => {
          return {
            start: moment.utc(slot.start).toDate(),  // Convert to UTC before saving
            end: moment.utc(slot.end).toDate(),      // Convert to UTC before saving
            availability: true,
            locked: false,
            lockedBy: null,
            lockExpiration: null,
            bookedBy: null,
          };
        });
  
        // Check if a record already exists for this doctor and date
        const existingSlot = await doctorSlotsModel.findOne({
          doctorId,
          date: slotDate,
        });
  
        if (existingSlot) {
           // Use Mongoose's `.push()` to add new slots to the DocumentArray
        existingSlot.slots.push(...slots); // Add the new slots
        await existingSlot.save()
        } else {
          // Create a new record
          await doctorSlotsModel.create({
            doctorId,
            date: slotDate,
            slots,
            active: true,
          });
        }
      }
  
      return { success: true, message: "Slots created/updated successfully" };
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

  async checkSlots(
    startDate: string,
    endDate: string,
    doctorId: string,
    timeSlots: Array<{ start: string; end: string }>
  ): Promise<boolean> {
    try {
      const startParsedDate = new Date(startDate);
      const endParsedDate = new Date(endDate);
  
      // Query the database to get all slots within the given date range for the doctor
      const slotsInRange = await doctorSlotsModel.find({
        doctorId: doctorId,
        date: { $gte: startParsedDate, $lte: endParsedDate },
      });

      console.log("timeslots",timeSlots);
     
  
      // Flatten all existing slots into a single array for easier comparison
      const existingSlots = slotsInRange.flatMap((record: any) => record.slots);
  
      // Check if any of the provided time slots overlap with existing slots
      for (const timeSlot of timeSlots) {
        const newStart = moment.utc(timeSlot.start).toDate()
        const newEnd = moment.utc(timeSlot.end).toDate()

        
        
  
        for (const slot of existingSlots) {
          const existingStart = new Date(slot.start)
          const existingEnd = new Date(slot.end)

          console.log("existing time",existingStart,existingEnd);
          console.log("time",newStart,newEnd);
  
          // Check for time overlap
          if (
            (newStart >= existingStart && newStart < existingEnd) || // Overlaps at the start
            (newEnd > existingStart && newEnd <= existingEnd) || // Overlaps at the end
            (newStart <= existingStart && newEnd >= existingEnd) // Completely overlaps
          ) {
            return false; // Conflict detected
          }
        }
      }
  
      return true; // No conflicts
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

  


  
  
}
