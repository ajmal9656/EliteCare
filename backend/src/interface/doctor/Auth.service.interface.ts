
import { IDoctorInfo } from "../doctorInterface/doctorInterface";



export interface IAuthService {
    signup(doctorData: {name: string;email: string;phone: string;password: string;confirmPassword: string;}): Promise<{token:string}>;
    otpCheck(otp: string, token: string): Promise<{ valid: boolean }>;
    resendOtpCheck(doctorToken: string): Promise<{token:string}>;
    verifyDoctor(email: string, password: string): Promise<{doctorInfo:IDoctorInfo,accessToken:string,refreshToken:string,}>;
   




    

    

    
    
 };