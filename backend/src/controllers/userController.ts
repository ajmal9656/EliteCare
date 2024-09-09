import { log } from "console";
import { userService } from "../services/userService";
import { Request, Response } from "express";
import cookieParser from 'cookie-parser';

export class userController {
  private userService: userService;

  constructor(userServiceInstance: userService) {
    this.userService = userServiceInstance;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const response = await this.userService.signup(data);
      
      // res.cookie('userData', "jxfhvjhfvb", {
        
      //   path:"/"
      // });
      console.log("aaaaaaaaaaa",response.token)
      
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
        console.log("vrtrwf")
      
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token)
      if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
      }

      
      const userOtp: string = req.body.otp;
      if (!userOtp) {
        
        res.status(400).json({ message: "OTP is required" });
        return;
      }
      console.log("otp",userOtp)

      
      const response = await this.userService.otpCheck(userOtp, token);
      if (response.valid) {

        console.log("trurrrrr")

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
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      console.log("login userController");
      

      const {email,password} = req.body;

      const loginResponse = await this.userService.verifyUser(email,password)
      console.log("controller res",loginResponse)
      
      const response = {
        accessToken:loginResponse.accessToken,
        userInfo:loginResponse.userInfo
      }
      res.cookie('refreshToken', loginResponse.refreshToken, {
        httpOnly: true,  // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
        sameSite: 'strict',  // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      });
      console.log("logindata",response)
      res.status(200).json({ message: "Login successful", response});
        
    } catch (error: any) {
      console.log("controller error")
      if(error.message==="User Doesn't exist"){
        res.status(400).json({ message: "User Doesn't exist" });

    }
      if(error.message==="Password is wrong"){
        res.status(400).json({ message: "Password is wrong" });

    }
      if(error.message==="User is Blocked"){
        res.status(400).json({ message: "User is Blocked" });

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

      
     
      
      const response = await this.userService.resendOtpCheck(token);
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

  async getSpecializations(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering addSpecialization method in adminController");

        

      
        const response = await this.userService.getSpecialization();

       
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
  async getDoctorsWithSpecialization(req: Request, res: Response): Promise<void> {
    try {
        console.log("Entering addSpecialization method in adminController");

        const specializationId = req.params.specializationId

      
        const response = await this.userService.getDoctorsWithSpecialization(specializationId);

       
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
}
