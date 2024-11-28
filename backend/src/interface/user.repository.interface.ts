import { Document } from "mongoose";
import { BookAppointment, Doctors, GetAppointments, GetDoctorsResponse, MedicalField, ScheduleSlot, SingleDoctor, Slot, userImage, UserProfile, UserProfileData, UserProfileDetails, userType } from "./userInterface/interface";

export interface IUserRepository {
    existUser(email:string,phone:string): Promise<{ existEmail: boolean; existPhone: boolean }>;
    createUser(userData: userType): Promise<Document>;
    userCheck(email:string): Promise<UserProfile | null>;
    getAllSpecialization(): Promise<MedicalField[]>;
    getAllDoctorsWithSpecialization(specializationId:string,page:number,limit:number,search:string): Promise<GetDoctorsResponse>;
    getAllDoctors(): Promise<Doctors[]>;
    getDoctor(doctorId:string,reviewData:any): Promise<SingleDoctor|null>;
    getAllSlots(date: Date, doctorId: string): Promise<ScheduleSlot[]>;
    getUser(doctorId:string): Promise<UserProfileDetails>;
    updateProfile(userId: string,updateData: { name: string; DOB: Date; address: string }): Promise<UserProfileData>;
    uploadProfileImage(userID: string, imageData: userImage): Promise<UserProfileData>;
    checkSlotAvailability(doctorId: string,slotId: Slot,date: string,userId: string): Promise<boolean>;
    createAppointment(patientData: any): Promise<BookAppointment|undefined>;
    updateAppointment(sessionId: any, appointmentId: any): Promise<BookAppointment|null>;
    confirmAppointmentPayment(appointmentId: string): Promise<BookAppointment|null>;
    getAllAppointments(userId: string, status: string, page: number, limit: number): Promise<GetAppointments>;
    cancelAppointment(appointmentId: string): Promise<BookAppointment>;
    addReview(appointmentId: string,rating: number,reviewText: string): Promise<BookAppointment>;
    getAppointment(appointmentId: string): Promise<BookAppointment>;
    
    
    
 };