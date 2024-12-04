
import { IWallet } from "../../model/walletModel";
import { docDetails, DoctorData, doctorImage, DoctorResult, GetTransactionData, IDashboardStats, IDoctor } from "../doctorInterface/doctorInterface";


export interface IDoctorRepository {
    
    uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<boolean>;
    getWalletDetails(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData>;
    withdrawMoney(doctorId: string, withdrawalAmount: number): Promise<IWallet>;
    getDoctor(doctorId: string, reviewData: any): Promise<IDoctor | null>
    updateProfile(doctorId: string,updateData: { fees: number; DOB: Date; phone: string }): Promise<DoctorResult>;
    getAllStatistics(doctorId: string): Promise<IDashboardStats>;
    uploadProfileImage(doctorID: string, imageData: doctorImage): Promise<DoctorResult>;
    doctorData(doctorId: string): Promise<any>

    

    
    
 };