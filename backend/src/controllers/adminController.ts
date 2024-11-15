import { Request, Response } from "express";
import { adminService } from "../services/adminServices";
import { log } from "util";


export class adminController {
    private adminService: adminService;



    constructor(adminServiceInstance: adminService) {
        this.adminService = adminServiceInstance;
      }



      
      async loginAdmin(req: Request, res: Response): Promise<void> {
        try {
          console.log("login adminController");
              
    
          const {email,password} = req.body;
    
          const loginResponse = await this.adminService.verifyAdmin(email,password)
          console.log("controller res",loginResponse)
          
          const response = {
            
            adminInfo:loginResponse.adminInfo
          }
          console.log(res);
          
          res.cookie('RefreshToken', loginResponse.refreshToken, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict',  // Protects against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 21 days
          });
          res.cookie('AccessToken', loginResponse.accessToken, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict',  // Protects against CSRF attacks
            maxAge: 1 * 24 * 60 * 60 * 1000,  // 7 days
          });
          console.log("logindata",response)
          res.status(200).json({ message: "Login successful", response});
            
        } catch (error: any) {
          console.log("controller error")
          if(error.message==="Admin Doesn't exist"){
            res.status(400).json({ message: "Admin Doesn't exist" });
    
        }
          if(error.message==="Password is wrong"){
            res.status(400).json({ message: "Password is wrong" });
    
        }
          if(error.message==="Admin is Blocked"){
            res.status(400).json({ message: "Admin is Blocked" });
    
        }
           
        }
      }
      async logoutAdmin(req: Request, res: Response): Promise<void> {
        try {
          // Clear the access token and refresh token cookies
          res.cookie('adminAccessToken', '', { httpOnly: true, expires: new Date(0) });
          res.cookie('adminRefreshToken', '', { httpOnly: true, expires: new Date(0) });
      
          // Send success response
          res.status(200).json({ message: "Logout successful" });
        } catch (error: any) {
          console.error('Logout error:', error);
          res.status(500).json({ message: "Logout failed" });
        }
      }
      async addSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering addSpecialization method in adminController");
    
           
            const { name, description } = req.body;
    
            
            const response = await this.adminService.addSpecialization(name, description);
    
            console.log("Specialization successfully created:", response);
    
           
            res.status(200).json({ message: "Specialization added successfully", response });
            
        } catch (error: any) {
         
            console.error("Error in addSpecialization controller:", error.message);
    
          
            if (error.message === "Something went wrong while creating the specialization.") {
                res.status(400).json({ message: "Something went wrong while creating the specialization." });
            } else {
                
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
    async getSpecialization(req: Request, res: Response): Promise<void> {
      try {
          // Extract pagination parameters from query (default to page 1 and limit 10 if not provided)
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;

          // Call the service to get paginated specializations
          const response = await this.adminService.getSpecialization(page, limit);

          // Respond with the result
          res.status(200).json({ message: "Specializations fetched successfully", response });
      } catch (error: any) {
          // Handle different error scenarios
          if (error.message === "Something went wrong while fetching the specialization.") {
              res.status(400).json({ message: "Something went wrong while fetching the specialization." });
          } else {
              res.status(500).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
      async editSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering editSpecialization method in adminController");
            const {id,name,description}  = req.body
     
            
    
          
            const response = await this.adminService.editSpecialization(id,name,description);
    
           
            console.log("Specialization successfully edited", response);
    
           
            res.status(200).json({ message: "Specialization updated successfully", response });
            
        } catch (error: any) {
           
            console.error("Error in editSpecialization controller:", error.message);
    
            if (error.message === "Something went wrong while editing the specialization.") {
                res.status(400).json({ message: "Something went wrong while editing the specialization." });
            } else {
              
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
      async listUnlistSpecialization(req: Request, res: Response): Promise<void> {
        try {
           
            const {id}  = req.body
     
            
    
          
            const response = await this.adminService.listUnlistSpecialization(id);
    
           
            
    
           
            res.status(200).json({ message: "updated successfully", response });
            
        } catch (error: any) {
           
           
              
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            
        }
    }
    async getApplication(req: Request, res: Response): Promise<void> {
      try {
          // Extract page and limit from query parameters with default values
          const page = parseInt(req.query.page as string, 10) || 1;
          const limit = parseInt(req.query.limit as string, 10) || 10;
  
          // Call the service layer to get applications with pagination
          const response = await this.adminService.getApplication(page, limit);
  
          res.status(200).json({ message: "Applications fetched successfully", response });
      } catch (error: any) {
          console.error("Error fetching applications:", error.message);
          
          if (error.message === "Something went wrong while fetching the applications.") {
              res.status(400).json({ message: "Something went wrong while fetching the applications." });
          } else {
              res.status(500).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
    async getDoctorApplication(req: Request, res: Response): Promise<void> {
      try {
          console.log("Entering  method in adminController");
          const applicationId = req.params.applicationId
          console.log("a;sasasasasa",applicationId)
  
          
  
        
          const response = await this.adminService.getDoctorApplication(applicationId as string);
  
         
          console.log("successfully fetched", response);
  
         
          res.status(200).json({ message: "successfully fetched", response });
          
      } catch (error: any) {
         
         
  
          if (error.message === "Something went wrong while fetching the data") {
              res.status(400).json({ message: "Something went wrong while fetching the data" });
          } else {
            
              res.status(500).json({ message: "An unexpected error occurred", error: error.message });
          }
      }
  }
    async approveApplication(req: Request, res: Response): Promise<void> {
      try {
          console.log("Entering approve method in adminController");
          const doctorId = req.params.doctorId
          console.log("sasa",doctorId)
  
          
  
        
          const response = await this.adminService.approveApplication(doctorId as string);
  
         
          console.log("successfully fetched", response);
  
         
          res.status(200).json({ message: "Application approved successfully"});
          
      } catch (error: any) {
         
         
  
         
            
              res.status(500).json({ message: "An unexpected error occurred", error: error.message });
          
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
  
      
      const response = await this.adminService.rejectApplication(doctorId as string, reason);
  
      console.log("Successfully processed rejection:", response);
      res.status(200).json({ message: "Application rejected successfully" });
      
    } catch (error: any) {
      console.error("Error in rejectApplication controller:", error.message);
      
      if (error.message === "Something went wrong while rejecting the application.") {
        res.status(400).json({ message: "Something went wrong while rejecting the application." });
      } else {
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
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
        const { users, totalPages } = await this.adminService.getAllUsers(skip, pageLimit,search);

        // Send the response with users and pagination details
        res.status(200).json({
            message: "Fetch users successfully",
            response: { users, totalPages }
        });
        
    } catch (error: any) {
        console.error("Error in getUsers controller:", error.message);
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
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
      const response = await this.adminService.getDoctors(pageNumber, pageLimit,search);

      console.log("Doctors successfully fetched", response);

      res.status(200).json({ message: "Fetched doctors successfully", response });
      
  } catch (error: any) {
      console.error("Error in getDoctors controller:", error.message);

      res.status(500).json({ message: "An unexpected error occurred", error: error.message });
  }
}


async listUnlistUser(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering editSpecialization method in adminController");
        const id  = req.params.userId
 
        

      
        const response = await this.adminService.listUnlistUser(id);

       
        console.log("user successfully edited", response);

       
        res.status(200).json({ message: "user updated successfully", response });
        
    } catch (error: any) {
       
        console.error("Error in edituser controller:", error.message);

        if (error.message === "Something went wrong while creating the user.") {
            res.status(400).json({ message: "Something went wrong while updating the user." });
        } else {
          
            res.status(500).json({ message: "An unexpected error occurred", error: error.message });
        }
    }
}
async listUnlistDoctor(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering editSpecialization method in adminController");
        const id  = req.params.doctorId
 
        

      
        const response = await this.adminService.listUnlistDoctor(id);

       
        console.log("Doctor successfully edited", response);

       
        res.status(200).json({ message: "Doctor updated successfully", response });
        
    } catch (error: any) {
       
        console.error("Error in edituser controller:", error.message);

        if (error.message === "Something went wrong while creating the user.") {
            res.status(400).json({ message: "Something went wrong while updating the user." });
        } else {
          
            res.status(500).json({ message: "An unexpected error occurred", error: error.message });
        }
    }
}
async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
        const response = await this.adminService.getDashboardData();

        res.status(200).json({ message: "Dashboard data retrieved successfully", response });
        
    } catch (error: any) {
        console.error("Error in getDashboardData controller:", error.message);

      
        if (error.message === "Something went wrong while retrieving dashboard data.") {
            res.status(400).json({ message: "Failed to retrieve dashboard data." });
        } else {
            res.status(500).json({ message: "An unexpected error occurred", error: error.message });
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
    const response = await this.adminService.getAppointments(status as string, pageNumber, limitNumber, startDate as string, endDate as string);

    // Respond with success and data
    res.status(200).json({ message: "Appointments fetched successfully", data: response });
  } catch (error: any) {
    console.error("Error fetching appointments:", error.message);
    if (error.message.includes("Failed to get appointments")) {
      res.status(400).json({ message: `Failed to get appointments: ${error.message}` });
    } else {
      res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
  }
}

  
  async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { status, startDate, endDate  } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
  
      const response = await this.adminService.getTransactions(status as string, page, limit, startDate as string, endDate as string);
  
      res.status(200).json({
        message: "Appointments fetched successfully",
        data: response.appointments,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);
      if (error.message.includes("Failed to get appointments")) {
        res.status(400).json({ message: `Failed to get appointments: ${error.message}` });
      } else {
        res.status(500).json({ message: "An unexpected error occurred", error: error.message });
      }
    }
  }

  
    

      
}
