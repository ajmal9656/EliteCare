import { doctorService } from "../services/doctorService";
import { DoctorFiles } from "../interface/doctorInterface/doctorInterface";
import { S3Service } from "../config/s3client";
import { Request, Response } from "express";



export class doctorController {
    private doctorService: doctorService;
    



    constructor(doctorServiceInstance: doctorService) {
        this.doctorService = doctorServiceInstance;
        
      }



      async createDoctor(req: Request, res: Response): Promise<void> {
        try {
          const data = req.body;
          const response = await this.doctorService.signup(data);
          
          // res.cookie('doctorData', "jxfhvjhfvb", {
            
          //   path:"/"
          // });
          
          
          res.status(200).json({ status: true, response });
        } catch (error: any) {
          if (error.message === "Email already in use") {
            res.status(409).json({ message: "Email already in use" });
          } else if (error.message === "Phone already in use") {
            res.status(409).json({ message: "Phone number already in use" });
          } else if (error.message === "Otp not send") {
            res.status(500).json({ message: "OTP not sent" });
          } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }

      async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            
          
          const token = req.headers.authorization?.split(" ")[1];
          
          if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
          }
          
    
          
          const doctorOtp: string = req.body.otp;
          if (!doctorOtp) {
            
            res.status(400).json({ message: "OTP is required" });
            return;
          }
          console.log("otppp",doctorOtp)
    
          
          const response = await this.doctorService.otpCheck(doctorOtp, token);
          if (response.valid) {
    
           
    
            res.status(200).json({ status: true, message: "OTP verified successfully" });
          } else {
            res.status(400).json({ status: false, message: "Invalid OTP" });
          }
        } catch (error: any) {
            
            
          if (error.message === "Invalid OTP") {
          
            res.status(400).json({ message: "Invalid OTP" });
          } else if (error.message === "OTP has expired") {
            res.status(400).json({ message: "OTP has expired" });
          } else if (error.message === "Invalid token") {
            res.status(401).json({ message: "Invalid token" });
          }  else if (error.message === "OTP has expired") {
            res.status(401).json({ message: "Token has expired" });
          } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }

      async loginDoctor(req: Request, res: Response): Promise<void> {
        try {
          
          
    
          const {email,password} = req.body;
    
          const loginResponse = await this.doctorService.verifyDoctor(email,password)
          
          
          const response = {
            accessToken:loginResponse.accessToken,
            doctorInfo:loginResponse.doctorInfo
          }
         
          
          res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,  
            maxAge: 7 * 24 * 60 * 60 * 1000,  
          });
         
          res.status(200).json({ message: "Login successful", response});
            
        } catch (error: any) {
         
          if(error.message==="Doctor Doesn't exist"){
            res.status(400).json({ message: "Doctor Doesn't exist" });
    
        }
          if(error.message==="Password is wrong"){
            res.status(400).json({ message: "Password is wrong" });
    
        }
          if(error.message==="Doctor is Blocked"){
            res.status(400).json({ message: "Doctor is Blocked" });
    
        }
           
        }
      }

      async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            
          
          const token = req.headers.authorization?.split(" ")[1];
         
          if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
          }
    
          
         
          
          const response = await this.doctorService.resendOtpCheck(token);
          if (response) {
    
            
    
            res.status(200).json({ status: true, message: "OTP Resended successfully",response });
          } else {
            res.status(400).json({ status: false, message: "something wnt wrong" });
          }
        } catch (error: any) {
            
            if (error.message === "Otp not send") {
              res.status(500).json({ message: "OTP not sent" });
            } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }
      async uploadDoctorData(req: Request, res: Response): Promise<void> {
        try {
           

    
          
         
          
          const response = await this.doctorService.uploadData(req.body,req.files as DoctorFiles);
          if (response) {
    
           
    
            res.status(200).json({ status: true, message: "Application Submitted"});
          } else {
            res.status(400).json({ status: false, message: "something wnt wrong" });
          }
        } catch (error: any) {
            
            
            if (error.message === "Otp not send") {
              res.status(500).json({ message: "OTP not sent" });
            } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }
      async createTimeSlot(req: Request, res: Response): Promise<void> {
        try {
            // Log incoming request data for debugging
            console.log("Control");
            console.log("Form data:", req.body);

            // Call the service layer to create the slot
            const response = await this.doctorService.createSlot(req.body);

            // Send success response
            res.status(200).json({ status: true, message: "Slot created successfully", data: response });
        } catch (error: any) {
            // Log the error for debugging
           

            // Handle different types of errors
            if (error.message === "Failed to create slot. No response received.") {
                res.status(500).json({ message: "Failed to create slot. No response received." });
            } else {
                res.status(500).json({ message: "Something went wrong, please try again later" });
            }
        }
    }
    async getTimeSlot(req: Request, res: Response): Promise<void> {
      try {
         
    
          // Access query parameters (they come as strings, so convert if necessary)
          const { date, doctorId } = req.query;
          console.log("date",date)
          
          if (!date || !doctorId) {
              res.status(400).json({ message: "Missing required query parameters: date or doctorId" });
          }
    
          // Call the service with query parameters
          const response = await this.doctorService.getSlots(date as string, doctorId as string);
          
    
          // Send success response
          res.status(200).json({ status: true, message: "Slot retrieved successfully", data: response });
      } catch (error: any) {
          
    
          res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
    async checkSlotAvailability(req: Request, res: Response): Promise<void> {
      try {
         
    
          // Access query parameters (they come as strings, so convert if necessary)
          const { date, doctorId,start,end } = req.body;
          console.log("dates",date)
          console.log("d",doctorId)
          console.log("s",start)
          console.log("e",end)
          
          if (!date || !doctorId) {
              res.status(400).json({ message: "Missing required query parameters: date or doctorId" });
          }
    
          // Call the service with query parameters
          const response = await this.doctorService.checkAvailability(date as string, doctorId as string,start as string,end as string);
          
    console.log(response)
          // Send success response
          res.status(200).json({ status: true, message: "Slot retrieved successfully", data: response });
      } catch (error: any) {
          
    
          res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
    async deleteSlot(req: Request, res: Response): Promise<void> {
      try {
        const { slotId, date, doctorId } = req.query;
    
        // Log the incoming query parameters
        console.log("Date:", date);
        console.log("Doctor ID:", doctorId);
        console.log("Slot ID:", slotId);
    
        // Validate query parameters
        if (!date || !doctorId || !slotId) {
           res.status(400).json({
            message: "Missing required query parameters: date, doctorId, or slotId"
          });
        }
    
        // Optional: Convert `date` to a Date object (if required by your service logic)
        const parsedDate = new Date(date as string);
        console.log("Date:", parsedDate);
    
        // Call the service with validated query parameters
        const response = await this.doctorService.deleteSlot(parsedDate as Date, doctorId as string, slotId as string);
    
        console.log("Service response:", response);
    
        // Send success response
        res.status(200).json({ 
          status: true, 
          message: "Slot deleted successfully", 
          data: response 
        });
      } catch (error: any) {
        // Log the error for debugging
        console.error("Error deleting slot:", error.message);
    
        // Send generic error response
        res.status(500).json({
          message: "Something went wrong, please try again later"
        });
      }
    }
    
    
  
}
