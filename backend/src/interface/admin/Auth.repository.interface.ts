
import { AdminDetails } from "../adminInterface/adminInterface";


export interface IAuthRepository {
    adminCheck(email:string):Promise<AdminDetails>;
    
    
    
};