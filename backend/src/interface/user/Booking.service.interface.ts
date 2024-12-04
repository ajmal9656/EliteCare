import { Appointment, BookAppointment,  GetAppointments,   Slot } from "../userInterface/interface";


export interface IBookingService {
    
    
   
    createSession(appointmentData: Appointment): Promise<any>;
    confirmAppointment(appointmentId: string): Promise<BookAppointment|null>;
    
    
    
 };