import { Document } from "mongoose";
import { BookAppointment, Doctors, GetAppointments, GetDoctorsResponse, MedicalField, ScheduleSlot, SingleDoctor, Slot, userImage, UserProfile, UserProfileData, UserProfileDetails, userType } from "../userInterface/interface";

export interface IAuthRepository {
    existUser(email:string,phone:string): Promise<{ existEmail: boolean; existPhone: boolean }>;
    createUser(userData: userType): Promise<Document>;
    userCheck(email:string): Promise<UserProfile | null>;
    
    
    
    
 };