import { UpdateWriteOpResult } from "mongoose";
import { AdminDetails, Application, Doctor, GetApplication, getAppointments, GetDoctor, getSpecialization, getTransaction, GetUser, MonthlyDashboardStats, Specialization, User } from "./adminInterface/adminInterface";


export interface IAdminRepository {
    adminCheck(email:string):Promise<AdminDetails>;
    createSpecialization(name:string,description:string):Promise<Specialization>
    getAllSpecialization(page: number, limit: number):Promise<getSpecialization>
    updateSpecialization(id:number,name:string,description:string):Promise<UpdateWriteOpResult>
    changeSpecializationStatus(id: number):Promise<Specialization>
    getAllApplication(page: number, limit: number) :Promise<GetApplication>
    getApplication(doctorId:string):Promise<Application|null>
    approveDoctorApplication(doctorId: string) :Promise<{status:boolean}>
    rejectDoctorApplication(doctorId: string, reason: string):Promise<{ success: boolean }>
    getAllUsers(skip: number, limit: number,search:string):Promise<GetUser>
    getAllDoctors(skip: number, limit: number,search:string):Promise<GetDoctor>
    changeUserStatus(id: string):Promise<User>
    changeDoctorStatus(id: string):Promise<Doctor>
    getAllStatistics():Promise<MonthlyDashboardStats>
    getAllAppointments(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<getAppointments>
    getAllTransactions(status: string,page: number,limit: number,startDate?: string,endDate?: string) :Promise<getTransaction>
    
    
};