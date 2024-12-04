
import { BookAppointment,  GetAppointments,  Slot,  } from "../userInterface/interface";

export interface IBookingRepository {
   
    
   
    createAppointment(patientData: any): Promise<BookAppointment|undefined>;
    updateAppointment(sessionId: any, appointmentId: any): Promise<BookAppointment|null>;
    confirmAppointmentPayment(appointmentId: string): Promise<BookAppointment|null>;
   
    
    
    
 };