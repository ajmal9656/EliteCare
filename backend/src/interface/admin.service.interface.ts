import { UpdateWriteOpResult } from "mongoose"
import { Admin, Application, Appointment, Doctor, GetApplication, GetDoctor, getSpecialization, getTransaction, MonthlyDashboardStats, Specialization, User } from "./adminInterface/adminInterface"



export interface IAdminService {
    verifyAdmin(email: string, password: string):Promise<{adminInfo:Admin,accessToken:string,refreshToken:string}>
    addSpecialization(name: string, description: string):Promise<Specialization>
    getSpecialization(page: number, limit: number): Promise<getSpecialization>
    editSpecialization(id:number,name:string,description:string):Promise<UpdateWriteOpResult>
    listUnlistSpecialization(id:number):Promise<Specialization>
    getApplication(page: number, limit: number):Promise<GetApplication>
    getDoctorApplication(applicationId:string):Promise<{response:Application,files:any}>
    approveApplication(doctorId:string):Promise<{status:boolean}>
    rejectApplication(doctorId:string,reason:string):Promise<{ success: boolean }>
    getAllUsers(skip: number, limit: number,search:any):Promise<{users:User[],totalPages:number}>
    getDoctors(page: number, limit: number,search:any):Promise<GetDoctor>
    listUnlistUser(id:string):Promise<User>
    listUnlistDoctor(id:string):Promise<Doctor>
    getDashboardData():Promise<MonthlyDashboardStats>
    getAppointments(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<{
        appointments: Appointment[],
        totalPages: number,
      }>
    getTransactions(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<getTransaction>
    
    
 };