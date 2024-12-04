import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IAdminService } from "../../interface/admin/Admin.service.interface";


export class AdminController {
    private AdminService: IAdminService;



    constructor(AdminServiceInstance: IAdminService) {
        this.AdminService = AdminServiceInstance;
      }



      
      
      async addSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering addSpecialization method in adminController");
    
           
            const { name, description } = req.body;
    
            
            const response = await this.AdminService.addSpecialization(name, description);
    
            console.log("Specialization successfully created:", response);
    
           
            res.status(HTTP_statusCode.OK).json({ message: "Specialization added successfully", response });
            
        } catch (error: any) {
         
            console.error("Error in addSpecialization controller:", error.message);
    
          
            if (error.message === "Something went wrong while creating the specialization.") {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while creating the specialization." });
            } else {
                
                res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
    async getSpecialization(req: Request, res: Response): Promise<void> {
      try {
          // Extract pagination parameters from query (default to page 1 and limit 10 if not provided)
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;

          // Call the service to get paginated specializations
          const response = await this.AdminService.getSpecialization(page, limit);

          // Respond with the result
          res.status(HTTP_statusCode.OK).json({ message: "Specializations fetched successfully", response });
      } catch (error: any) {
          // Handle different error scenarios
          if (error.message === "Something went wrong while fetching the specialization.") {
              res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while fetching the specialization." });
          } else {
              res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
      async editSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering editSpecialization method in adminController");
            const {id,name,description}  = req.body
     
            
    
          
            const response = await this.AdminService.editSpecialization(id,name,description);
    
           
            console.log("Specialization successfully edited", response);
    
           
            res.status(HTTP_statusCode.OK).json({ message: "Specialization updated successfully", response });
            
        } catch (error: any) {
           
            console.error("Error in editSpecialization controller:", error.message);
    
            if (error.message === "Something went wrong while editing the specialization.") {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while editing the specialization." });
            } else {
              
                res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
      async listUnlistSpecialization(req: Request, res: Response): Promise<void> {
        try {
           
            const {id}  = req.body
     
            
    
          
            const response = await this.AdminService.listUnlistSpecialization(id);
    
           
            
    
           
            res.status(HTTP_statusCode.OK).json({ message: "updated successfully", response });
            
        } catch (error: any) {
           
           
              
                res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
            
        }
    }
    async getApplication(req: Request, res: Response): Promise<void> {
      try {
          // Extract page and limit from query parameters with default values
          const page = parseInt(req.query.page as string, 10) || 1;
          const limit = parseInt(req.query.limit as string, 10) || 10;
  
          // Call the service layer to get applications with pagination
          const response = await this.AdminService.getApplication(page, limit);
  
          res.status(HTTP_statusCode.OK).json({ message: "Applications fetched successfully", response });
      } catch (error: any) {
          console.error("Error fetching applications:", error.message);
          
          if (error.message === "Something went wrong while fetching the applications.") {
              res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while fetching the applications." });
          } else {
              res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
    async getDoctorApplication(req: Request, res: Response): Promise<void> {
      try {
          console.log("Entering  method in adminController");
          const applicationId = req.params.applicationId
          console.log("a;sasasasasa",applicationId)
  
          
  
        
          const response = await this.AdminService.getDoctorApplication(applicationId as string);
  
         
          console.log("successfully fetched", response);
  
         
          res.status(HTTP_statusCode.OK).json({ message: "successfully fetched", response });
          
      } catch (error: any) {
         
         
  
          if (error.message === "Something went wrong while fetching the data") {
              res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while fetching the data" });
          } else {
            
              res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
    async approveApplication(req: Request, res: Response): Promise<void> {
      try {
          console.log("Entering approve method in adminController");
          const doctorId = req.params.doctorId
          console.log("sasa",doctorId)
  
          
  
        
          const response = await this.AdminService.approveApplication(doctorId as string);
  
         
          console.log("successfully fetched", response);
  
         
          res.status(HTTP_statusCode.OK).json({ message: "Application approved successfully"});
          
      } catch (error: any) {
         
         
  
         
            
              res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
          
      }
  }
 

  async rejectApplication(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering reject method in adminController");
      const doctorId = req.params.doctorId;
      const { reason } = req.body; 
      console.log("Doctor ID:", doctorId);
      console.log("Rejection Reason:", reason);
      console.log("Rhgff:", req.body);
  
      
      const response = await this.AdminService.rejectApplication(doctorId as string, reason);
  
      console.log("Successfully processed rejection:", response);
      res.status(HTTP_statusCode.OK).json({ message: "Application rejected successfully" });
      
    } catch (error: any) {
      console.error("Error in rejectApplication controller:", error.message);
      
      if (error.message === "Something went wrong while rejecting the application.") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while rejecting the application." });
      } else {
        res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
      }
    }
  }
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10,search } = req.query;

        console.log("query",search);
        console.log("query",page);
        console.log("query",limit);
        
        
        // Calculate skip based on page and limit
        const pageNumber = parseInt(page as string, 10);
      const pageLimit = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * pageLimit;

        // Fetch users with pagination
        const { users, totalPages } = await this.AdminService.getAllUsers(skip, pageLimit,search);

        // Send the response with users and pagination details
        res.status(HTTP_statusCode.OK).json({
            message: "Fetch users successfully",
            response: { users, totalPages }
        });
        
    } catch (error: any) {
        console.error("Error in getUsers controller:", error.message);
        res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
    }
}
async getDoctors(req: Request, res: Response): Promise<void> {
  try {
      console.log("Entering getDoctors searc method in adminController");

      const { page = 1, limit = 10,search } = req.query; // Default page is 1, limit is 10

      // Convert the page and limit to integers
      const pageNumber = parseInt(page as string, 10);
      const pageLimit = parseInt(limit as string, 10);

      // Pass pagination parameters to the service
      const response = await this.AdminService.getDoctors(pageNumber, pageLimit,search);

      console.log("Doctors successfully fetched", response);

      res.status(HTTP_statusCode.OK).json({ message: "Fetched doctors successfully", response });
      
  } catch (error: any) {
      console.error("Error in getDoctors controller:", error.message);

      res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
  }
}


async listUnlistUser(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering editSpecialization method in adminController");
        const id  = req.params.userId
 
        

      
        const response = await this.AdminService.listUnlistUser(id);

       
        console.log("user successfully edited", response);

       
        res.status(HTTP_statusCode.OK).json({ message: "user updated successfully", response });
        
    } catch (error: any) {
       
        console.error("Error in edituser controller:", error.message);

        if (error.message === "Something went wrong while creating the user.") {
            res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while updating the user." });
        } else {
          
            res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
        }
    }
}
async listUnlistDoctor(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering editSpecialization method in adminController");
        const id  = req.params.doctorId
 
        

      
        const response = await this.AdminService.listUnlistDoctor(id);

       
        console.log("Doctor successfully edited", response);

       
        res.status(HTTP_statusCode.OK).json({ message: "Doctor updated successfully", response });
        
    } catch (error: any) {
       
        console.error("Error in edituser controller:", error.message);

        if (error.message === "Something went wrong while creating the user.") {
            res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong while updating the user." });
        } else {
          
            res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
        }
    }
}
async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
        const response = await this.AdminService.getDashboardData();

        res.status(HTTP_statusCode.OK).json({ message: "Dashboard data retrieved successfully", response });
        
    } catch (error: any) {
        console.error("Error in getDashboardData controller:", error.message);

      
        if (error.message === "Something went wrong while retrieving dashboard data.") {
            res.status(HTTP_statusCode.BadRequest).json({ message: "Failed to retrieve dashboard data." });
        } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
        }
    }
}

async getAllAppointments(req: Request, res: Response): Promise<void> {
  try {
    // Extract status, page, limit, startDate, and endDate from query parameters
    const { status = "All", page = 1, limit = 10, startDate, endDate } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Call the service method to get the appointments with pagination and date filtering
    const response = await this.AdminService.getAppointments(status as string, pageNumber, limitNumber, startDate as string, endDate as string);

    // Respond with success and data
    res.status(HTTP_statusCode.OK).json({ message: "Appointments fetched successfully", data: response });
  } catch (error: any) {
    console.error("Error fetching appointments:", error.message);
    if (error.message.includes("Failed to get appointments")) {
      res.status(HTTP_statusCode.BadRequest).json({ message: `Failed to get appointments: ${error.message}` });
    } else {
      res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
    }
  }
}

  
  async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { status, startDate, endDate  } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
  
      const response = await this.AdminService.getTransactions(status as string, page, limit, startDate as string, endDate as string);
  
      res.status(HTTP_statusCode.OK).json({
        message: "Appointments fetched successfully",
        data: response.appointments,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);
      if (error.message.includes("Failed to get appointments")) {
        res.status(HTTP_statusCode.BadRequest).json({ message: `Failed to get appointments: ${error.message}` });
      } else {
        res.status(HTTP_statusCode.InternalServerError).json({ message: "An unexpected error occurred", error: error.message });
      }
    }
  }

  
    

      
}
