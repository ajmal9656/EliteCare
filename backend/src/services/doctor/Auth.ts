import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  doctorType,
  IDoctorInfo,
} from "../../interface/doctorInterface/doctorInterface";
import { IAuthRepository } from "../../interface/doctor/Auth.repository.interface";

dotenv.config();

export class AuthService {
  private AuthRepository: IAuthRepository;
  private OTP: string | null = null;
  private expiryOTP_time: Date | null = null;
  private doctorData: doctorType | null = null;
  

  constructor(
    AuthRepository:IAuthRepository,
    
  ) {
    this.AuthRepository = AuthRepository;
    
  }

  async signup(doctorData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<{token:string}> {
    try {
      const response = await this.AuthRepository.existDoctor(
        doctorData.email,
        doctorData.phone
      );
      if (response.existEmail) {
        throw new Error("Email already in use");
      }
      if (response.existPhone) {
        throw new Error("Phone already in use");
      }

      let saltRounds: number = 10;

      const hashedPassword = await bcrypt.hash(doctorData.password, saltRounds);

      const doctorId = uuidv4();
      this.doctorData = {
        doctorId: doctorId,
        name: doctorData.name,
        email: doctorData.email,
        phone: doctorData.phone,
        password: hashedPassword,
        createdAt: new Date(),
        kycStatus: "pending",
      };
      const Generated_OTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      const hashedOTP: string = await bcrypt.hash(Generated_OTP, saltRounds);

      this.OTP = hashedOTP;
      
      let subject = 'OTP Verification';
      let text = `Your OTP is ${Generated_OTP}`; 

      const sendMailStatus: boolean = await sendMail(
        doctorData.email,
        subject,text
      );

      if (!sendMailStatus) {
        throw new Error("Otp not send");
      }
      const Generated_time = new Date();

      this.expiryOTP_time = new Date(Generated_time.getTime() + 60 * 1000);

      const token = jwt.sign(
        {
          doctorData: this.doctorData,
          OTP: this.OTP,
          expirationTime: this.expiryOTP_time,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1min",
        }
      );

      return { token };
    } catch (error: any) {
      throw error;
    }
  }

  async otpCheck(otp: string, token: string): Promise<{ valid: boolean }> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      const tokenOTP = decoded.OTP;
      const expirationTime = new Date(decoded.expirationTime);
      const doctorData = decoded.doctorData;

      if (new Date() < expirationTime) {
        const result = await bcrypt.compare(otp, tokenOTP);
        if (result) {
          await this.AuthRepository.createDoctor(doctorData);

          return { valid: true };
        } else {
        
          throw new Error("Invalid OTP");
        }
      } else {
        throw new Error("OTP has expired");
      }
    } catch (error: any) {
      console.log("errrrrrr", error);

      if (error instanceof jwt.TokenExpiredError) {
        console.log(error.message);

        throw new Error("Token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }

  async resendOtpCheck(doctorToken: string): Promise<{token:string}> {
    try {
      const decoded: any = jwt.decode(doctorToken);

      const email = decoded.doctorData.email;

      const Generated_OTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      let saltRounds: number = 10;
      const hashedOTP: string = await bcrypt.hash(Generated_OTP, saltRounds);
      console.log("top", Generated_OTP);

      this.OTP = hashedOTP;

      console.log("dd",Generated_OTP);
      

      let text = `Your OTP is ${Generated_OTP}`; 
      let subject = 'OTP Verification';

      const sendMailStatus: boolean = await sendMail(email, subject,text);

      if (!sendMailStatus) {
        throw new Error("Otp not send");
      }
      const Generated_time = new Date();

      this.expiryOTP_time = new Date(Generated_time.getTime() + 60 * 1000);

      const token = jwt.sign(
        {
          doctorData: this.doctorData,
          OTP: this.OTP,
          expirationTime: this.expiryOTP_time,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1min",
        }
      );

      return { token };
    } catch (error: any) {
      throw error;
    }
  }

  async verifyDoctor(email: string, password: string): Promise<{
    doctorInfo:IDoctorInfo,
    accessToken:string,
    refreshToken:string,
  }> {
    try {
      const doctorData = await this.AuthRepository.doctorCheck(email);
      if (doctorData) {
        const result = await bcrypt.compare(password, doctorData.password);
        if (!result) {
          throw new Error("Password is wrong");
        }
        if (doctorData.isBlocked) {
          throw new Error("Doctor is Blocked");
        }

        const accessToken = jwt.sign(
          { id: doctorData.doctorId, email: doctorData.email, role: "doctor" },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1hr",
          }
        );
        const refreshToken = jwt.sign(
          { id: doctorData.doctorId, email: doctorData.email, role: "doctor" },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );

        const doctorInfo = {
          name: doctorData.name,
          email: doctorData.email,
          doctorId: doctorData._id,
          phone: doctorData.phone,
          isBlocked: doctorData.isBlocked,
          docStatus: doctorData.kycStatus,
          rejectedReason: doctorData.rejectedReason,
        };
        

        return {
          doctorInfo,
          accessToken,
          refreshToken,
        };
      } else {
        throw new Error("doctor Doesn't exist");
      }
    } catch (error: any) {
      console.log("service error");
      throw new Error(error.message);
    }
  }
  
 
  


  



  

  
}
