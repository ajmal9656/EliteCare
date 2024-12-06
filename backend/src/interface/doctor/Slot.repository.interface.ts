
import {   Slot } from "../doctorInterface/doctorInterface";


export interface ISlotRepository {
    createSlot(data: any): Promise<{success:boolean,message:string} >;
    getSlots(date: string, doctorId: string): Promise<Slot[]>;
    checkSlots( startDate: string,
        endDate: string,
        doctorId: string,
        timeSlots: Array<{ start: string; end: string }>): Promise<boolean>;
    deleteTimeSlot(date: Date, doctorId: string, slotId: string): Promise<boolean>;
   

    

    
    
 };