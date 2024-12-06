
import {   Slot, TimeSlot } from "../doctorInterface/doctorInterface";



export interface ISlotService {
    
    createSlot(data: TimeSlot): Promise<{success:boolean,message:string}>;
    getSlots(date: string, doctorId: string): Promise<Slot[]>;
    checkAvailability(startDate: string,
        endDate:string,
        doctorId: string,
        timeSlots: Array<{ start: string; end: string }>,): Promise<boolean>;
    deleteSlot(date: Date, doctorId: string, slotId: string): Promise<boolean>;
   
    

    
    
 };