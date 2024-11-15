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
    async getSpecialization(page: number, limit: number): Promise<any> {
        try {
            // Call the repository method to get paginated specializations
            const response = await this.adminRepository.getAllSpecialization(page, limit);

            if (response) {
                return response;
            } else {
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
            // Handle and log error in service
            console.error("Error in getSpecialization:", error.message);
            throw new Error(`Failed to fetch specializations: ${error.message}`);
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
    async getApplication(page: number, limit: number) {
        try {
            const response = await this.adminRepository.getAllApplication(page, limit);
    
            if (response.applications) {
                console.log("Applications successfully fetched:", response.applications);
                return response;
            } else {
                throw new Error("Something went wrong while fetching the applications.");
            }
        } catch (error: any) {
            console.error("Error in getApplication:", error.message);
            throw new Error(`Failed to fetch applications: ${error.message}`);
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
    async getAllUsers(skip: number, limit: number,search:any) {
        try {
            // Fetch users with pagination
            const { users, totalPages } = await this.adminRepository.getAllUsers(skip, limit,search);

            console.log("Fetched users:", users);
            console.log("Total pages:", totalPages);

            // Return users along with totalPages
            return { users, totalPages };

        } catch (error: any) {
            console.error("Error in AdminService:", error.message);
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
    async getDoctors(page: number, limit: number,search:any) {
        try {
            console.log("Entering getDoctors search method in adminService");
    
            const skip = (page - 1) * limit; // Calculate the number of documents to skip for pagination
    
            const response = await this.adminRepository.getAllDoctors(skip, limit,search);
    
            if (response) {
                console.log("Doctors successfully fetched:", response);
                return response;
            } else {
                console.error("Failed to get doctors: Response is invalid");
                throw new Error("Something went wrong while fetching doctors.");
            }
        } catch (error: any) {
            console.error("Error in getDoctors service:", error.message);
            throw new Error(`Failed to fetch doctors: ${error.message}`);
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

    async getAppointments(status: string, page: number, limit: number, startDate?: string, endDate?: string) {
        try {
          const response = await this.adminRepository.getAllAppointments(status, page, limit, startDate, endDate);
      
          // If response is valid, format the appointments
          if (Array.isArray(response.appointments)) {
            const formattedAppointments = response.appointments.map(appointment => {
              return {
                ...appointment,
                start: this.getTime(appointment.start),
                end: this.getTime(appointment.end),
              };
            });
      
            return {
              appointments: formattedAppointments,
              totalPages: response.totalPages,
            };
          } else {
            console.error("Failed to get appointments: Response is invalid", response);
            throw new Error("Something went wrong while fetching the appointments.");
          }
        } catch (error: any) {
          console.error("Error in getAppointments:", error.stack || error.message);
          throw new Error(`Failed to get appointments: ${error.message}`);
        }
      }
      
      
      async getTransactions(status: string, page: number, limit: number, startDate?: string, endDate?: string) {
        try {
          const response = await this.adminRepository.getAllTransactions(status, page, limit, startDate, endDate);
          return response;
        } catch (error: any) {
          console.error("Error in getTransactions:", error.stack || error.message);
          throw new Error(`Failed to get transactions: ${error.message}`);
        }
      }
      
    getTime(slot:any){
        return moment(slot).tz('UTC').format('h:mm A')
      }
    


}