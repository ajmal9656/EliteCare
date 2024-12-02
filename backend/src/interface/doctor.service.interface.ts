import { IWallet } from "../model/walletModel";
import { AppointmentData, DoctorData, DoctorFiles, DoctorSchedule, FileData, GetAppointmentData, GetTransactionData, IDashboardStats, IDoctor, IDoctorImageInfo, IDoctorInfo, IDoctorInformation, IMedicalReport, Slot, TimeSlot } from "./doctorInterface/doctorInterface";



export interface IDoctorService {
    signup(doctorData: {name: string;email: string;phone: string;password: string;confirmPassword: string;}): Promise<{token:string}>;
    otpCheck(otp: string, token: string): Promise<{ valid: boolean }>;
    resendOtpCheck(doctorToken: string): Promise<{token:string}>;
    verifyDoctor(email: string, password: string): Promise<{doctorInfo:IDoctorInfo,accessToken:string,refreshToken:string,}>;
    uploadData(data: DoctorData, files: DoctorFiles): Promise<boolean|undefined>;
    createSlot(data: TimeSlot): Promise<any>;
    getSlots(date: string, doctorId: string): Promise<Slot[]>;
    checkAvailability(startDate: string,
        endDate:string,
        doctorId: string,
        timeSlots: Array<{ start: string; end: string }>,): Promise<boolean>;
    deleteSlot(date: Date, doctorId: string, slotId: string): Promise<boolean>;
    getAppointments(doctorId: string,status: string,page: number, limit: number ,startDate: Date | null ,endDate: Date | null ): Promise<GetAppointmentData>;
    cancelAppointment(appointmentId: string, reason: string): Promise<AppointmentData>;
    addPrescription(appointmentId: string,prescription: string): Promise<AppointmentData>;
    getWallet(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData>;
    withdraw(doctorId: string, withdrawalAmount: number): Promise<IWallet>;
    getDoctorData(doctorId: string, reviewData: any): Promise<IDoctor|undefined>;
    updateProfile(_id: string,updateData: { fees: number; DOB: Date; phone: string }): Promise<{doctorInfo:IDoctorInformation}>;
    getDashboardData(doctorId: string): Promise<IDashboardStats>;
    updateImage(userID: string, file: FileData): Promise<{doctorInfo:IDoctorImageInfo}>;
    getMedicalRecords(userId: string): Promise<IMedicalReport[]>
    doctorDetails(doctorId: string): Promise<any>




    

    

    
    
 };