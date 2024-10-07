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
            
            
            
            res.status(500).json({ message: "Something went wrong, please try again later" });
          
        }
      }
      async createTimeSlot(req: Request, res: Response): Promise<void> {
        try {
            

            
            const response = await this.doctorService.createSlot(req.body);

          
            res.status(200).json({ status: true, message: "Slot created successfully", data: response });
        } catch (error: any) {
          
           

           
            if (error.message === "Failed to create slot. No response received.") {
                res.status(500).json({ message: "Failed to create slot. No response received." });
            } else {
                res.status(500).json({ message: "Something went wrong, please try again later" });
            }
        }
    }
    async getTimeSlot(req: Request, res: Response): Promise<void> {
      try {
         
    
          
          const { date, doctorId } = req.query;
          
          
          if (!date || !doctorId) {
              res.status(400).json({ message: "Missing required query parameters: date or doctorId" });
          }
    
       
          const response = await this.doctorService.getSlots(date as string, doctorId as string);
          
    
         
          res.status(200).json({ status: true, message: "Slot retrieved successfully", data: response });
      } catch (error: any) {
          
    
          res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
    async checkSlotAvailability(req: Request, res: Response): Promise<void> {
      try {
         
    
         
          const { date, doctorId,start,end } = req.body;
         
          
          if (!date || !doctorId) {
              res.status(400).json({ message: "Missing required query parameters: date or doctorId" });
          }
    
          
          const response = await this.doctorService.checkAvailability(date as string, doctorId as string,start as string,end as string);
          
   
          
          res.status(200).json({ status: true, data: response });
      } catch (error: any) {
          
    
          res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
    async deleteSlot(req: Request, res: Response): Promise<void> {
      try {
        const { slotId, date, doctorId } = req.query;
    
        
        
    
        
        if (!date || !doctorId || !slotId) {
           res.status(400).json({
            message: "Missing required query parameters: date, doctorId, or slotId"
          });
        }
    
       
        const parsedDate = new Date(date as string);
        
    
       
        const response = await this.doctorService.deleteSlot(parsedDate as Date, doctorId as string, slotId as string);
    
        
    
        
        res.status(200).json({ 
          status: true, 
          message: "Slot deleted successfully", 
          data: response 
        });
      } catch (error: any) {
        
        console.error("Error deleting slot:", error.message);
    
        
        res.status(500).json({
          message: "Something went wrong, please try again later"
        });
      }
    }

    async getAllAppointments(req: Request, res: Response): Promise<void> {
  try {
      const doctorId = req.params.doctorId;
      const {status} = req.query
      
      

      // // Fetch appointments using the doctorId
      const response = await this.doctorService.getAppointments(doctorId,status as string);

      
      

      // If successful, send a 200 status with the fetched appointments
      res.status(200).json({ message: "Appointments fetched successfully", data: response});
  } catch (error: any) {
      console.error("Error fetching appointments:", error.message);

      // Send a 400 response if the error is known, else send a 500 for an unexpected error
      if (error.message.includes("Failed to get appointments")) {
          res.status(400).json({ message: `Failed to get appointments: ${error.message}` });
      } else {
          res.status(500).json({ message: "An unexpected error occurred", error: error.message });
      }
  }
}

async cancelAppointment(req: Request, res: Response): Promise<void> {
  try {
    // Extract appointmentId and Reason from the request body
    const { appointmentId, reason } = req.body;

    // Log the received values for debugging
    console.log("Received appointmentId:", appointmentId);
    console.log("Received Reason:", reason);

    // Call the service to cancel the appointment using the appointmentId and Reason
    const response = await this.doctorService.cancelAppointment(appointmentId, reason);

    // Log the response for debugging
    console.log("Cancel Appointment Response:", response);

    // If successful, send a 200 status with the updated appointment
    res.status(200).json({ message: "Appointment canceled successfully", data: response });
  } catch (error: any) {
    console.error("Error canceling appointment:", error.message);

    // If the error message is related to the cancellation process, return a 400 status
    if (error.message.includes("Failed to cancel appointment")) {
      res.status(400).json({ message: `Failed to cancel appointment: ${error.message}` });
    } else {
      // Otherwise, send a 500 status for unexpected errors
      res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
  }
}
async addPrescription(req: Request, res: Response): Promise<void> {
  try {
    // Extract appointmentId and prescription from the request body
    const { appointmentId, prescription } = req.body;

    // Log the received values for debugging
    console.log("Received appointmentId:", appointmentId);
    console.log("Received prescription:", prescription);

    // Call the service to add a prescription to the appointment
    const response = await this.doctorService.addPrescription(appointmentId, prescription);

    // Log the response for debugging
    console.log("Add Prescription Response:", response);

    // If successful, send a 200 status with the updated appointment data
    res.status(200).json({ message: "Prescription added successfully", data: response });
  } catch (error: any) {
    console.error("Error adding prescription:", error.message);

    // If the error is related to the prescription process, return a 400 status
    if (error.message.includes("Failed to add prescription")) {
      res.status(400).json({ message: `Failed to add prescription: ${error.message}` });
    } else {
      // Otherwise, send a 500 status for unexpected errors
      res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
  }
}

async getWallet(req: Request, res: Response): Promise<void> {
  try {
      const doctorId = req.params.doctorId;
      const { status } = req.query;

      // Validate the presence of doctorId
      if (!doctorId) {
          res.status(400).json({ message: "Doctor ID is required." });
          return;
      }

      // Fetch wallet data using the doctorId and status
      const response = await this.doctorService.getWallet(doctorId, status as string);

      // If successful, send a 200 status with the fetched wallet data
      res.status(200).json({ success: true, message: "Wallet data fetched successfully", response });
  } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      // Send a 400 response for known errors, else send a 500 for unexpected errors
      if (error.message.includes("Failed to get wallet details")) {
          res.status(400).json({ success: false, message: `Failed to get wallet details: ${error.message}` });
      } else {
          res.status(500).json({ success: false, message: "An unexpected error occurred." });
      }
  }
}
async withdraw(req: Request, res: Response): Promise<void> {
  try {
      const doctorId = req.params.doctorId;
      const withdrawalAmount = req.body.withdrawAmount; // Access the withdrawal amount correctly from the request body
console.log(req.body);
console.log(withdrawalAmount);
console.log(typeof withdrawalAmount);

      // Validate the presence of doctorId and withdrawalAmount
      if (!doctorId) {
          res.status(400).json({ success: false, message: "Doctor ID is required." });
          return;
      }
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
          res.status(400).json({ success: false, message: "A valid withdrawal amount is required." });
          return;
      }

      // Fetch wallet data using the doctorId and withdrawalAmount
      const response = await this.doctorService.withdraw(doctorId, withdrawalAmount);

      // If successful, send a 200 response with the fetched wallet data
      res.status(200).json({ success: true, message: "Withdrawal successful", response });
  } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      // Send a 400 response for known errors, else send a 500 for unexpected errors
      if (error.message.includes("Failed to get wallet details")) {
          res.status(400).json({ success: false, message: `Failed to get wallet details: ${error.message}` });
      } else {
          res.status(500).json({ success: false, message: "An unexpected error occurred." });
      }
  }
}




    
    
  
}
