import jwt from "jsonwebtoken";
import { Admin,adminType } from '../../interface/adminInterface/adminInterface';
import { IAuthRepository } from "../../interface/admin/Auth.repository.interface";
import { IAuthService } from "../../interface/admin/Auth.service.interface";







export class AuthService implements IAuthService {
    private AuthRepository: IAuthRepository;
   

   private adminData: adminType | null = null;


    constructor(AuthRepository: IAuthRepository) {
        this.AuthRepository = AuthRepository;
        
     };
   

     
    
    async verifyAdmin(email: string, password: string):Promise<{adminInfo:Admin,accessToken:string,refreshToken:string}> {
        try {
            
            const adminData = await this.AuthRepository.adminCheck(email);
            if (adminData) {
                
                if (password != adminData.password) {
                    throw new Error("Password is wrong");
                }
                
    
                const accessToken = jwt.sign({id: adminData._id, email: adminData.email,role:"admin" }, process.env.JWT_SECRET as string, {
                    expiresIn: "1hr"
                });
                const refreshToken = jwt.sign({id: adminData._id,email: adminData.email,role:"admin" }, process.env.JWT_SECRET as string, {
                    expiresIn: "7d"
                });
                
                const adminInfo = {
                    
                    email: adminData.email,
                    
                    
                    
                };
                
                return {
                    adminInfo,
                    accessToken,
                    refreshToken
                };
            } else {
                
                throw new Error("Admin Doesn't exist");
            }
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }

    


}