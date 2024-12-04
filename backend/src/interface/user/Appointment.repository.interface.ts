
import { BookAppointment,  GetAppointments,Slot, } from "../userInterface/interface";

export interface IAppointmentRepository {
   
    
    checkSlotAvailability(doctorId: string,slotId: Slot,date: string,userId: string): Promise<boolean>;
    getAllAppointments(userId: string, status: string, page: number, limit: number): Promise<GetAppointments>;
    cancelAppointment(appointmentId: string): Promise<BookAppointment>;
    addReview(appointmentId: string,rating: number,reviewText: string): Promise<BookAppointment>;
    getAppointment(appointmentId: string): Promise<BookAppointment>;
    
    
    
 };