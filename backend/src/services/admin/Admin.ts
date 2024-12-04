
import { adminType, Application, Appointment, Doctor, GetApplication, GetDoctor, getSpecialization, getTransaction, MonthlyDashboardStats, Specialization, User } from '../../interface/adminInterface/adminInterface';
import { S3Service } from '../../config/s3client';
import moment from 'moment';
import { UpdateWriteOpResult } from 'mongoose';
import { IAdminRepository } from '../../interface/admin/Admin.repository.interface';
import { IAdminService } from '../../interface/admin/Admin.service.interface';








export class AdminService implements IAdminService {
    private AdminRepository: IAdminRepository;
    private S3Service: S3Service;

   private adminData: adminType | null = null;


    constructor(AdminRepository: IAdminRepository,S3ServiceInstance: S3Service) {
        this.AdminRepository = AdminRepository;
        this.S3Service = S3ServiceInstance;
     };
   

     
    
    
    async addSpecialization(name: string, description: string):Promise<Specialization> {
        try {
           
    
            
            const response = await this.AdminRepository.createSpecialization(name, description);
    
           
            if (response) {
                
                return response;
            } else {
              
                throw new Error("Something went wrong while creating the specialization.");
            }
        } catch (error: any) {
            
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getSpecialization(page: number, limit: number): Promise<getSpecialization> {
        try {
            // Call the repository method to get paginated specializations
            const response = await this.AdminRepository.getAllSpecialization(page, limit);

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
    async editSpecialization(id:number,name:string,description:string):Promise<UpdateWriteOpResult> {
        try {
            
    
            
            const response = await this.AdminRepository.updateSpecialization(id,name,description);
    
           
            if (response) {
              
                return response;
            } else {
               
                console.error("Failed to edit specialization: Response is invalid");
                throw new Error("Something went wrong while editing the specialization.");
            }
        } catch (error: any) {
            
           
            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }
    
    async listUnlistSpecialization(id:number):Promise<Specialization> {
        try {
            
    
            
            const response = await this.AdminRepository.changeSpecializationStatus(id);
    
            
            if (response) {
               
                return response;
            } else{
                throw new Error("Something went wrong while editing the specialization.");

            }
        } catch (error: any) {
            
            
            throw new Error(`Failed: ${error.message}`);
        }
    }
    async getApplication(page: number, limit: number):Promise<GetApplication> {
        try {
            const response = await this.AdminRepository.getAllApplication(page, limit);
    
            if (response.applications) {
                
                return response;
            } else {
                throw new Error("Something went wrong while fetching the applications.");
            }
        } catch (error: any) {
            console.error("Error in getApplication:", error.message);
            throw new Error(`Failed to fetch applications: ${error.message}`);
        }
    }
    async getDoctorApplication(applicationId:string):Promise<{response:Application,files:any}> {
        try {
           
    
            
            const response = await this.AdminRepository.getApplication(applicationId);
            const documents = []




    
            
            if (response) {
                
                documents.push(response.image);
                documents.push(
                    response.kycDetails.certificateImage,
                    response.kycDetails.qualificationImage,
                    response.kycDetails.adharFrontImage,
                    response.kycDetails.adharBackImage
                  );
                  
                  const signedFiles = await Promise.all(
                    documents.map(async (file: { type: string, url: string }) => {
                        const folderPath = this.getFolderPathByFileType(file.type);
                        const signedUrl = await this.S3Service.getFile(file.url, folderPath);
                        return { ...file, signedUrl };
                    })
                );
                 const files = signedFiles
                 console.log("filess",files);
                 
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
    async approveApplication(doctorId:string):Promise<{ status: boolean }> {
        try {
            
    
            
            const response = await this.AdminRepository.approveDoctorApplication(doctorId);
            return response
            




    
           
        } catch (error: any) {
            
           
            throw new Error(`Failed : ${error.message}`);
        }
    }
    async rejectApplication(doctorId:string,reason:string):Promise<{ success: boolean }> {
        try {
            
    
            
            const response = await this.AdminRepository.rejectDoctorApplication(doctorId,reason);
            return response
            




    
           
        } catch (error: any) {
            
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getAllUsers(skip: number, limit: number,search:any):Promise<{users:User[],totalPages:number}> {
        try {
            // Fetch users with pagination
            const { users, totalPages } = await this.AdminRepository.getAllUsers(skip, limit,search);

           

            // Return users along with totalPages
            return { users, totalPages };

        } catch (error: any) {
            console.error("Error in AdminService:", error.message);
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
    async getDoctors(page: number, limit: number,search:any):Promise<GetDoctor> {
        try {
            
    
            const skip = (page - 1) * limit; // Calculate the number of documents to skip for pagination
    
            const response = await this.AdminRepository.getAllDoctors(skip, limit,search);
    
            if (response) {
                
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
    

    async listUnlistUser(id:string):Promise<User> {
        try {
            
    
            
            const response = await this.AdminRepository.changeUserStatus(id);
    
           
            if (response) {
               
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
    async listUnlistDoctor(id:string):Promise<Doctor> {
        try {
            
    
            
            const response = await this.AdminRepository.changeDoctorStatus(id);
    
           
            if (response) {
                
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
    async getDashboardData():Promise<MonthlyDashboardStats> {
        try {
            
    
            const response = await this.AdminRepository.getAllStatistics();
    
           
            if (response) {
                
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

    async getAppointments(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<{
        appointments: Appointment[],
        totalPages: number,
      }> {
        try {
          const response = await this.AdminRepository.getAllAppointments(status, page, limit, startDate, endDate);
      
          // If response is valid, format the appointments
          if (Array.isArray(response.appointments)) {
            const formattedAppointments = response.appointments.map((appointment:any) => {
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
      
      
      async getTransactions(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<getTransaction> {
        try {
          const response = await this.AdminRepository.getAllTransactions(status, page, limit, startDate, endDate);
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