
import adminModel from "../../model/adminModel";

import { AdminDetails} from "../../interface/adminInterface/adminInterface";
import { IAuthRepository } from "../../interface/admin/Auth.repository.interface";



export class AuthRepository implements IAuthRepository {
   
    

    async adminCheck(email:string):Promise<AdminDetails>{
        try {
            
            const adminData = await adminModel.findOne({email:email})
            
            if(adminData){
                
                
                
                return adminData
            }
            throw new Error("Doctor Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
   
      
      
    
    
    
      
      
    
    
    
    
    
    
    
   
}
