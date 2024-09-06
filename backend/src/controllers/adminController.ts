import { Request, Response } from "express";
import { adminService } from "../services/adminServices";


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
            accessToken:loginResponse.accessToken,
            adminInfo:loginResponse.adminInfo
          }
          console.log(res);
          
          res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,  
            maxAge: 7 * 24 * 60 * 60 * 1000,  
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
      async addSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering addSpecialization method in adminController");
    
            // Extract name and description from request body
            const { name, description } = req.body;
    
            // Call the service to add a new specialization
            const response = await this.adminService.addSpecialization(name, description);
    
            // Log the response for debugging
            console.log("Specialization successfully created:", response);
    
            // Send success response
            res.status(200).json({ message: "Specialization added successfully", response });
            
        } catch (error: any) {
            // Log the error for debugging
            console.error("Error in addSpecialization controller:", error.message);
    
            // Send appropriate error response based on the error message
            if (error.message === "Something went wrong while creating the specialization.") {
                res.status(400).json({ message: "Something went wrong while creating the specialization." });
            } else {
                // Handle any other unexpected errors
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
      async getSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering addSpecialization method in adminController");
    
            
    
          
            const response = await this.adminService.getSpecialization();
    
           
            console.log("Specialization successfully fetched", response);
    
           
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
      async editSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering editSpecialization method in adminController");
            const {id,name,description}  = req.body
     
            
    
          
            const response = await this.adminService.editSpecialization(id,name,description);
    
           
            console.log("Specialization successfully edited", response);
    
           
            res.status(200).json({ message: "Specialization updated successfully", response });
            
        } catch (error: any) {
           
            console.error("Error in editSpecialization controller:", error.message);
    
            if (error.message === "Something went wrong while creating the specialization.") {
                res.status(400).json({ message: "Something went wrong while updating the specialization." });
            } else {
              
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
      async listUnlistSpecialization(req: Request, res: Response): Promise<void> {
        try {
            console.log("Entering editSpecialization method in adminController");
            const {id}  = req.body
     
            
    
          
            const response = await this.adminService.listUnlistSpecialization(id);
    
           
            console.log("Specialization successfully edited", response);
    
           
            res.status(200).json({ message: "Specialization updated successfully", response });
            
        } catch (error: any) {
           
            console.error("Error in editSpecialization controller:", error.message);
    
            if (error.message === "Something went wrong while creating the specialization.") {
                res.status(400).json({ message: "Something went wrong while updating the specialization." });
            } else {
              
                res.status(500).json({ message: "An unexpected error occurred", error: error.message });
            }
        }
    }
    

      
}
