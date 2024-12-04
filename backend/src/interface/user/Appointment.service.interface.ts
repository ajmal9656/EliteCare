import { Appointment, BookAppointment,  GetAppointments,  Slot,  } from "../userInterface/interface";


export interface IAppointmentService {
    
    
    checkSlotLocked(doctorId: string,slotId: Slot,date: string,userId: string): Promise<boolean>;
    getAppointments(userId: string, status: string, page: number, limit: number): Promise<GetAppointments>;
    cancelAppointment(appointmentId: string): Promise<BookAppointment|undefined>;
    addReview(appointmentId: string,rating: number,review: string): Promise<BookAppointment>;
    getAppointment(appointmentId: string): Promise<BookAppointment>;
    
    
 };