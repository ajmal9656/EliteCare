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
            console.log("verifyController")
          
          const token = req.headers.authorization?.split(" ")[1];
          console.log(token)
          if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
          }
          console.log("token",token)
    
          
          const doctorOtp: string = req.body.otp;
          if (!doctorOtp) {
            
            res.status(400).json({ message: "OTP is required" });
            return;
          }
          console.log("otppp",doctorOtp)
    
          
          const response = await this.doctorService.otpCheck(doctorOtp, token);
          if (response.valid) {
    
            console.log("trueeeeeee")
    
            res.status(200).json({ status: true, message: "OTP verified successfully" });
          } else {
            res.status(400).json({ status: false, message: "Invalid OTP" });
          }
        } catch (error: any) {
            console.log("kkkk",error);
            
          if (error.message === "Invalid OTP") {
            console.log("errorotp")
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
          console.log("login userController");
          
    
          const {email,password} = req.body;
    
          const loginResponse = await this.doctorService.verifyDoctor(email,password)
          console.log("controller res",loginResponse)
          
          const response = {
            accessToken:loginResponse.accessToken,
            doctorInfo:loginResponse.doctorInfo
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
            console.log("resendControl")
          
          const token = req.headers.authorization?.split(" ")[1];
          console.log("tokennn",token)
          if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
          }
    
          
         
          
          const response = await this.doctorService.resendOtpCheck(token);
          if (response) {
    
            console.log("teeerurrrrr")
    
            res.status(200).json({ status: true, message: "OTP Resended successfully",response });
          } else {
            res.status(400).json({ status: false, message: "something wnt wrong" });
          }
        } catch (error: any) {
            console.log("kkkk",error);
            
            if (error.message === "Otp not send") {
              res.status(500).json({ message: "OTP not sent" });
            } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }
      async uploadDoctorData(req: Request, res: Response): Promise<void> {
        try {
            console.log("Control")
          console.log(req.body)
          console.log(req.files);

    
          
         
          
          const response = await this.doctorService.uploadData(req.body,req.files as DoctorFiles);
          if (response) {
    
            console.log("teeerurrrrr")
    
            res.status(200).json({ status: true, message: "Application Submitted"});
          } else {
            res.status(400).json({ status: false, message: "something wnt wrong" });
          }
        } catch (error: any) {
            console.log("kkkk",error);
            
            if (error.message === "Otp not send") {
              res.status(500).json({ message: "OTP not sent" });
            } else {
            res.status(500).json({ message: "Something went wrong, please try again later" });
          }
        }
      }
}
