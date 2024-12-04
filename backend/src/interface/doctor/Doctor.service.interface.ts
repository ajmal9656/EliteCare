import { IWallet } from "../../model/walletModel";
import { DoctorData, DoctorFiles, FileData, GetTransactionData, IDashboardStats, IDoctor, IDoctorImageInfo, IDoctorInformation } from "../doctorInterface/doctorInterface";



export interface IDoctorService {
    uploadData(data: DoctorData, files: DoctorFiles): Promise<boolean|undefined>;
    getWallet(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData>;
    withdraw(doctorId: string, withdrawalAmount: number): Promise<IWallet>;
    getDoctorData(doctorId: string, reviewData: any): Promise<IDoctor|undefined>;
    updateProfile(_id: string,updateData: { fees: number; DOB: Date; phone: string }): Promise<{doctorInfo:IDoctorInformation}>;
    getDashboardData(doctorId: string): Promise<IDashboardStats>;
    updateImage(userID: string, file: FileData): Promise<{doctorInfo:IDoctorImageInfo}>;
    doctorDetails(doctorId: string): Promise<any>




    

    

    
    
 };