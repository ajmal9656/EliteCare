import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { adminRepository } from '../repository/adminRepository';
import { Admin,adminType } from '../interface/adminInterface/adminInterface';







export class adminService{
    private adminRepository: adminRepository;

   private adminData: adminType | null = null;


    constructor(adminRepository: adminRepository) {
        this.adminRepository = adminRepository;
     };
   

     
    
    async verifyAdmin(email: string, password: string) {
        try {
            console.log("login adminService");
            const adminData = await this.adminRepository.adminCheck(email);
            if (adminData) {
                
                if (password != adminData.password) {
                    throw new Error("Password is wrong");
                }
                
    
                const accessToken = jwt.sign({ email: adminData.email }, process.env.JWT_SECRET as string, {
                    expiresIn: "1hr"
                });
                const refreshToken = jwt.sign({email: adminData.email }, process.env.JWT_SECRET as string, {
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
                console.log("Admindata not found")
                throw new Error("Admin Doesn't exist");
            }
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }
    async addSpecialization(name: string, description: string) {
        try {
            console.log("Entering addSpecialization method in adminService");
    
            // Call the repository method to create a new specialization
            const response = await this.adminRepository.createSpecialization(name, description);
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully created:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to create specialization: Response is invalid");
                throw new Error("Something went wrong while creating the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getSpecialization() {
        try {
            console.log("Entering getSpecialization method in adminService");
    
            
            const response = await this.adminRepository.getAllSpecialization();
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully fetched:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to get specialization: Response is invalid");
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async editSpecialization(id:number,name:string,description:string) {
        try {
            console.log("Entering editSpecialization method in adminService");
    
            
            const response = await this.adminRepository.updateSpecialization(id,name,description);
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully edited:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to edit specialization: Response is invalid");
                throw new Error("Something went wrong while editing the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in editSpecialization:", error.message);
            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }
    
    async listUnlistSpecialization(id:number) {
        try {
            console.log("Entering editSpecialization method in adminService");
    
            
            const response = await this.adminRepository.changeSpecializationStatus(id);
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully edited:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to edit specialization: Response is invalid");
                throw new Error("Something went wrong while editing the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in editSpecialization:", error.message);
            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }
    


}