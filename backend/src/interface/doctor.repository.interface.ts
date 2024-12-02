import { Document } from "mongoose";
import { IWallet } from "../model/walletModel";
import { AppointmentData, docDetails, DoctorData, doctorImage, DoctorResult, DoctorSchedule, doctorType, GetAppointmentData, GetTransactionData, IDashboardStats, IDoctor, IMedicalReport, Slot, TimeSlot } from "./doctorInterface/doctorInterface";


export interface IDoctorRepository {
    existDoctor(email:string,phone:string): Promise<{ existEmail: boolean; existPhone: boolean }>;
    createDoctor(doctorData: doctorType): Promise<Document>;
    doctorCheck(email: string): Promise<DoctorResult>;
    uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<boolean>;
    createSlot(data: any): Promise<any>;
    getSlots(date: string, doctorId: string): Promise<Slot[]>;
    checkSlots( startDate: string,
        endDate: string,
        doctorId: string,
        timeSlots: Array<{ start: string; end: string }>): Promise<boolean>;
    deleteTimeSlot(date: Date, doctorId: string, slotId: string): Promise<boolean>;
    getAllAppointments(doctorId: string,status: string,page: number, limit: number,startDate: Date | null,endDate: Date | null) : Promise<GetAppointmentData>
    cancelAppointment(appointmentId: string, reason: string): Promise<AppointmentData>;
    completeAppointment(appointmentId: string,prescription: string): Promise<AppointmentData>;
    getWalletDetails(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData>;
    withdrawMoney(doctorId: string, withdrawalAmount: number): Promise<IWallet>;
    getDoctor(doctorId: string, reviewData: any): Promise<IDoctor | null>
    updateProfile(doctorId: string,updateData: { fees: number; DOB: Date; phone: string }): Promise<DoctorResult>;
    getAllStatistics(doctorId: string): Promise<IDashboardStats>;
    uploadProfileImage(doctorID: string, imageData: doctorImage): Promise<DoctorResult>;
    getMedicalRecords(userId: string): Promise<IMedicalReport[]>;
    doctorData(doctorId: string): Promise<any>

    

    
    
 };