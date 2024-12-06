
import dotenv from "dotenv";
import {
  TimeSlot,
  Slot,
} from "../../interface/doctorInterface/doctorInterface";
import { ISlotRepository } from "../../interface/doctor/Slot.repository.interface";
import { ISlotService } from "../../interface/doctor/Slot.service.interface";

dotenv.config();

export class SlotService implements ISlotService {
  private SlotRepository: ISlotRepository;
  

  constructor(
    SlotRepository:ISlotRepository,
    
  ) {
    this.SlotRepository = SlotRepository;
    
  }


  
  async createSlot(data: TimeSlot): Promise<{success:boolean,message:string}> {
    try {
      const response = await this.SlotRepository.createSlot(data);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to create slot. No response received.");
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async getSlots(date: string, doctorId: string): Promise<Slot[]> {
    try {
      const response = await this.SlotRepository.getSlots(date, doctorId);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to retrieve slot. No response received.");
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async checkAvailability(
    startDate: string,
    endDate:string,
    doctorId: string,
    timeSlots: Array<{ start: string; end: string }>,
    
  ): Promise<boolean> {
    try {
      const response = await this.SlotRepository.checkSlots(
        startDate,
        endDate,
        doctorId,
        timeSlots
      );

      if (response) {
        return response;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async deleteSlot(date: Date, doctorId: string, slotId: string): Promise<boolean> {
    try {
      const response = await this.SlotRepository.deleteTimeSlot(
        date,
        doctorId,
        slotId
      );

      if (response) {
        return response;
      } else {
        throw new Error(
          "Failed to delete slot. No response received from the repository."
        );
      }
    } catch (error: any) {
      throw new Error(`Error deleting slot: ${error.message}`);
    }
  }

  
  


 

  
  

 

  

  

 

  

 

 

  

  
}
