import { AppointmentData, GetAppointmentData, IMedicalReport } from "../doctorInterface/doctorInterface";


export interface IAppointmentRepository {
    
    getAllAppointments(doctorId: string,status: string,page: number, limit: number,startDate: Date | null,endDate: Date | null) : Promise<GetAppointmentData>
    cancelAppointment(appointmentId: string, reason: string): Promise<AppointmentData>;
    completeAppointment(appointmentId: string,prescription: string): Promise<AppointmentData>;
    getMedicalRecords(userId: string): Promise<IMedicalReport[]>;
    

    

    
    
 };