import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { adminRepository } from '../repository/adminRepository';
import { Admin,adminType } from '../interface/adminInterface/adminInterface';
import { S3Service } from '../config/s3client';
import moment from 'moment';







export class adminService{
    private adminRepository: adminRepository;
    private S3Service: S3Service;

   private adminData: adminType | null = null;


    constructor(adminRepository: adminRepository,S3ServiceInstance: S3Service) {
        this.adminRepository = adminRepository;
        this.S3Service = S3ServiceInstance;
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
    
            
            const response = await this.adminRepository.createSpecialization(name, description);
    
           
            if (response) {
                console.log("Specialization successfully created:", response);
                return response;
            } else {
              
                console.error("Failed to create specialization: Response is invalid");
                throw new Error("Something went wrong while creating the specialization.");
            }
        } catch (error: any) {
            
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getSpecialization() {
        try {
            
    
            
            const response = await this.adminRepository.getAllSpecialization();
    
          
            if (response) {
                console.log("Specialization successfully fetched:", response);
                return response;
            } else {
            
                console.error("Failed to get specialization: Response is invalid");
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
        
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async editSpecialization(id:number,name:string,description:string) {
        try {
            console.log("Entering editSpecialization method in adminService");
    
            
            const response = await this.adminRepository.updateSpecialization(id,name,description);
    
           
            if (response) {
                console.log("Specialization successfully edited:", response);
                return response;
            } else {
               
                console.error("Failed to edit specialization: Response is invalid");
                throw new Error("Something went wrong while editing the specialization.");
            }
        } catch (error: any) {
            
           
            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }
    
    async listUnlistSpecialization(id:number) {
        try {
            console.log("Entering editSpecialization method in adminService");
    
            
            const response = await this.adminRepository.changeSpecializationStatus(id);
    
            
            if (response) {
               
                return response;
            } 
        } catch (error: any) {
            
            
            throw new Error(`Failed: ${error.message}`);
        }
    }
    async getApplication() {
        try {
            console.log("Entering getSpecialization method in adminService");
    
            
            const response = await this.adminRepository.getAllApplication();
    
           
            if (response) {
                console.log("applicaton successfully fetched:", response);
                return response;
            } else {
                
                console.error("Failed to get applicatons: Response is invalid");
                throw new Error("Something went wrong while fetching the applicatons.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getDoctorApplication(applicationId:string) {
        try {
           
    
            
            const response = await this.adminRepository.getApplication(applicationId);
            const documents = []




    
            
            if (response) {
                console.log("data successfully fetched:", response);
                documents.push(response.image);
                documents.push(
                    response.kycDetails.certificateImage,
                    response.kycDetails.qualificationImage,
                    response.kycDetails.adharFrontImage,
                    response.kycDetails.adharBackImage
                  );
                  console.log(documents);
                  const signedFiles = await Promise.all(
                    documents.map(async (file: { type: string, url: string }) => {
                        const folderPath = this.getFolderPathByFileType(file.type);
                        const signedUrl = await this.S3Service.getFile(file.url, folderPath);
                        return { ...file, signedUrl };
                    })
                );
                 const files = signedFiles
                return {response,files};
            } else {
               
                
                throw new Error("Something went wrong while fetching the data");
            }
        } catch (error: any) {
            
            throw new Error(`Failed : ${error.message}`);
        }
    }
    
    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case 'profile image':
                return 'eliteCare/doctorProfileImages';
            case 'document':
                return 'eliteCare/doctorDocuments';
            
            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }
    async approveApplication(doctorId:string) {
        try {
            console.log("Entering approve method in adminService");
    
            
            const response = await this.adminRepository.approveDoctorApplication(doctorId);
            return response
            




    
           
        } catch (error: any) {
            
           
            throw new Error(`Failed : ${error.message}`);
        }
    }
    async rejectApplication(doctorId:string,reason:string) {
        try {
            console.log("Entering reject method in adminService");
    
            
            const response = await this.adminRepository.rejectDoctorApplication(doctorId,reason);
            return response
            




    
           
        } catch (error: any) {
            
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getUsers() {
        try {
            console.log("Entering getuser method in adminService");
    
            
            const response = await this.adminRepository.getAllUsers();
    
          
            if (response) {
                console.log("user successfully fetched:", response);
                return response;
            } else {
                
                console.error("Failed to get user: Response is invalid");
                throw new Error("Something went wrong while fetching the user.");
            }
        } catch (error: any) {
            
            console.error("Error in user:", error.message);
            throw new Error(`Failed to user: ${error.message}`);
        }
    }
    async getDoctors() {
        try {
            console.log("Entering getuser method in adminService");
    
            
            const response = await this.adminRepository.getAllDoctors();
    
           
            if (response) {
                console.log("user successfully fetched:", response);
                return response;
            } else {
                
                console.error("Failed to get user: Response is invalid");
                throw new Error("Something went wrong while fetching the user.");
            }
        } catch (error: any) {
            
            console.error("Error in user:", error.message);
            throw new Error(`Failed to user: ${error.message}`);
        }
    }

    async listUnlistUser(id:string) {
        try {
            console.log("Entering edituser method in adminService");
    
            
            const response = await this.adminRepository.changeUserStatus(id);
    
           
            if (response) {
                console.log("user successfully edited:", response);
                return response;
            } else {
                
                console.error("Failed to edit user: Response is invalid");
                throw new Error("Something went wrong while editing the user.");
            }
        } catch (error: any) {
          
            console.error("Error in edituser:", error.message);
            throw new Error(`Failed to edit user: ${error.message}`);
        }
    }
    async listUnlistDoctor(id:string) {
        try {
            console.log("Entering editoctor method in adminService");
    
            
            const response = await this.adminRepository.changeDoctorStatus(id);
    
           
            if (response) {
                console.log("octor successfully edited:", response);
                return response;
            } else {
               
                console.error("Failed to edit user: Response is invalid");
                throw new Error("Something went wrong while editing the user.");
            }
        } catch (error: any) {
            
            console.error("Error in edituser:", error.message);
            throw new Error(`Failed to edit user: ${error.message}`);
        }
    }
    async getDashboardData() {
        try {
            console.log("Entering getDashboardData method in adminService");
    
            const response = await this.adminRepository.getAllStatistics();
    
           
            if (response) {
                console.log("Dashboardsss data successfully retrieved:", response);
                return response;
            } else {
                
                console.error("Failed to retrieve dashboard data: Response is invalid");
                throw new Error("Something went wrong while retrieving dashboard data.");
            }
        } catch (error: any) {
            
            console.error("Error in getDashboardData:", error.message);
            throw new Error(`Failed to retrieve dashboard data: ${error.message}`);
        }
    }

    async getAppointments(status: string) {
        try {
            
            const response = await this.adminRepository.getAllAppointments(status);
    
           
    
            
            if (Array.isArray(response)) {
               
                const formattedAppointments = response.map(appointment => {
                    return {
                        ...appointment,
                        start: this.getTime(appointment.start),
                        end: this.getTime(appointment.end)
                    };
                });
    
                return formattedAppointments; 
            } else {
                
                console.error("Failed to get appointments: Response is invalid", response);
                throw new Error("Something went wrong while fetching the appointments.");
            }
        } catch (error: any) {
            
            console.error("Error in getAppointments:", error.stack || error.message);
            throw new Error(`Failed to get appointments: ${error.message}`);
        }
    }
    async getTransactions(status: string) {
        try {
            
            const response = await this.adminRepository.getAllTransactions(status);
    
           
    
            
            
                return response; 
            
        } catch (error: any) {
            
            console.error("Error in getAppointments:", error.stack || error.message);
            throw new Error(`Failed to get appointments: ${error.message}`);
        }
    }
    getTime(slot:any){
        return moment(slot).tz('UTC').format('h:mm A')
      }
    


}