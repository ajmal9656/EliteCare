
import {  Doctors,  GetDoctorsResponse, MedicalField, ScheduleSlot, SingleDoctor,  userImage,  UserProfileData, UserProfileDetails } from ".././userInterface/interface";

export interface IUserRepository {
   
    getAllSpecialization(): Promise<MedicalField[]>;
    getAllDoctorsWithSpecialization(specializationId:string,page:number,limit:number,search:string): Promise<GetDoctorsResponse>;
    getAllDoctors(): Promise<Doctors[]>;
    getDoctor(doctorId:string,reviewData:any): Promise<SingleDoctor|null>;
    getAllSlots(date: Date, doctorId: string): Promise<ScheduleSlot[]>;
    getUser(doctorId:string): Promise<UserProfileDetails>;
    updateProfile(userId: string,updateData: { name: string; DOB: Date; address: string }): Promise<UserProfileData>;
    uploadProfileImage(userID: string, imageData: userImage): Promise<UserProfileData>;
    
    
    
    
 };