
import { Admin } from "../adminInterface/adminInterface"



export interface IAuthService {
    verifyAdmin(email: string, password: string):Promise<{adminInfo:Admin,accessToken:string,refreshToken:string}>
   
    
    
 };