import { Appointment, BookAppointment, Doctors, FileData, GetAppointments, GetDoctorsResponse, GetUserData, MedicalField, ScheduleSlot, SingleDoctor, Slot, UserProfileData, UserProfileDetails } from ".././userInterface/interface";


export interface IUserService {
    
    getSpecialization(): Promise<MedicalField[]>;
    getDoctorsWithSpecialization(specializationId:string,page:number,limit:number,search:string): Promise<GetDoctorsResponse>;
    getDoctors(): Promise<Doctors[]>;
    getDoctorData(doctorId: string, reviewData: any): Promise<SingleDoctor|null|undefined>;
    getSlots(date: string, doctorId: string): Promise<ScheduleSlot[]>;
    getUserData(userId: string): Promise<UserProfileDetails|undefined>;
    updateProfile(_id: string,updateData: { name: string; DOB: Date; address: string }): Promise<{userInfo:UserProfileData}>;
    updateImage(userID: string, file: FileData): Promise<{userInfo:UserProfileData}|undefined>;
   
    
    
    
 };