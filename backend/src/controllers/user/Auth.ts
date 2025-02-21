import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IAuthService } from "../../interface/user/Auth.service.interface";
import { Request, Response } from "express";

export class AuthController {
  private authService: IAuthService;

  constructor(authServiceInstance: IAuthService) {
    this.authService = authServiceInstance;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
        console.log("create user auth");
        
      const data = req.body;
      const response = await this.authService.signup(data);

      // res.cookie('userData', "jxfhvjhfvb", {

      //   path:"/"
      // });

      res.status(HTTP_statusCode.OK).json({ status: true, response });
    } catch (error: any) {
      if (error.message === "Email already in use") {
        res.status(HTTP_statusCode.Conflict).json({ message: "Email already in use" });
      } else if (error.message === "Phone already in use") {
        res.status(HTTP_statusCode.Conflict).json({ message: "Phone number already in use" });
      } else if (error.message === "Otp not send") {
        res.status(HTTP_statusCode.InternalServerError).json({ message: "OTP not sent" });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
        console.log("verify otp auth");
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(HTTP_statusCode.Unauthorized).json({ message: "No token provided" });
        return;
      }

      const userOtp: string = req.body.otp;
      if (!userOtp) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "OTP is required" });
        return;
      }
      console.log("otp", userOtp);

      const response = await this.authService.otpCheck(userOtp, token);
      if (response.valid) {
        res
          .status(HTTP_statusCode.OK)
          .json({ status: true, message: "OTP verified successfully" });
      } else {
        res.status(HTTP_statusCode.BadRequest).json({ status: false, message: "Invalid OTP" });
      }
    } catch (error: any) {
      if (error.message === "Invalid OTP") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Invalid OTP" });
      } else if (error.message === "OTP has expired") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "OTP has expired" });
      } else if (error.message === "Invalid token") {
        res.status(HTTP_statusCode.Unauthorized).json({ message: "Invalid token" });
      } else if (error.message === "OTP has expired") {
        res.status(HTTP_statusCode.Unauthorized).json({ message: "Token has expired" });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      console.log("sssssssssssssssss");
      
        
        
      const { email, password } = req.body;

      const loginResponse = await this.authService.verifyUser(email, password);

      const response = {
        userInfo: loginResponse.userInfo,
      };
      res.cookie("RefreshToken", loginResponse.refreshToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        // secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 21 days
      });
      res.cookie("AccessToken", loginResponse.accessToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        // secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(HTTP_statusCode.OK).json({ message: "Login successful", response });
    } catch (error: any) {
      if (error.message === "User Doesn't exist") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "User Doesn't exist" });
      }
      if (error.message === "Password is wrong") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Password is wrong" });
      }
      if (error.message === "User is Blocked") {
        res.status(HTTP_statusCode.BadRequest).json({ message: "User is Blocked" });
      }
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      // Clear the access token and refresh token cookies
      res.cookie("AccessToken", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.cookie("RefreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      // Send success response
      res.status(HTTP_statusCode.OK).json({ message: "Logout successful" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(HTTP_statusCode.InternalServerError).json({ message: "Logout failed" });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
        console.log("resend auth");
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(HTTP_statusCode.Unauthorized).json({ message: "No token provided" });
        return;
      }

      const response = await this.authService.resendOtpCheck(token);
      if (response) {
        res
          .status(HTTP_statusCode.OK)
          .json({
            status: true,
            message: "OTP Resended successfully",
            response,
          });
      } else {
        res.status(HTTP_statusCode.BadRequest).json({ status: false, message: "something wnt wrong" });
      }
    } catch (error: any) {
      if (error.message === "Otp not send") {
        res.status(HTTP_statusCode.InternalServerError).json({ message: "OTP not sent" });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  
  
  
  
  
  
  
  
  
  
  
  

  

  
  

  
}
