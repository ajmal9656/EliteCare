import { Appointment, BookAppointment, Doctors, FileData, GetAppointments, GetDoctorsResponse, GetUserData, MedicalField, ScheduleSlot, SingleDoctor, Slot, UserProfileData, UserProfileDetails } from "./userInterface/interface";


export interface IUserService {
    signup(userData: {name: string;email: string;phone: string;password: string;confirmpassword: string;}): Promise<{token:string}>;
    otpCheck(otp: string, token: string): Promise<{valid:boolean}>;
    verifyUser(email: string, password: string): Promise<GetUserData>;
    resendOtpCheck(userToken: string): Promise<{token:string}>;
    getSpecialization(): Promise<MedicalField[]>;
    getDoctorsWithSpecialization(specializationId:string,page:number,limit:number,search:string): Promise<GetDoctorsResponse>;
    getDoctors(): Promise<Doctors[]>;
    getDoctorData(doctorId: string, reviewData: any): Promise<SingleDoctor|null|undefined>;
    getSlots(date: string, doctorId: string): Promise<ScheduleSlot[]>;
    getUserData(userId: string): Promise<UserProfileDetails|undefined>;
    updateProfile(_id: string,updateData: { name: string; DOB: Date; address: string }): Promise<{userInfo:UserProfileData}>;
    updateImage(userID: string, file: FileData): Promise<{userInfo:UserProfileData}|undefined>;
    checkSlotLocked(doctorId: string,slotId: Slot,date: string,userId: string): Promise<boolean>;
    createSession(appointmentData: Appointment): Promise<any>;
    confirmAppointment(appointmentId: string): Promise<BookAppointment|null>;
    getAppointments(userId: string, status: string, page: number, limit: number): Promise<GetAppointments>;
    cancelAppointment(appointmentId: string): Promise<BookAppointment|undefined>;
    addReview(appointmentId: string,rating: number,review: string): Promise<BookAppointment>;
    getAppointment(appointmentId: string): Promise<BookAppointment>;
    
    
 };