import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { GetUserData, userType } from "../../interface/userInterface/interface";
import sendMail from "../../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { S3Service } from "../../config/s3client";
import moment from "moment";
import { IAuthService } from "../../interface/user/Auth.service.interface";
import { IAuthRepository } from "../../interface/user/Auth.repository.interface";


dotenv.config();

const S3Services = new S3Service();
export class AuthService implements IAuthService {
  private S3Services = new S3Service();
  private AuthRepository: IAuthRepository;
  private OTP: string | null = null;
  private expiryOTP_time: Date | null = null;
  private userData: userType | null = null;

  constructor(AuthRepository: IAuthRepository) {
    this.AuthRepository = AuthRepository;
  }

  async signup(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmpassword: string;
  }): Promise<{token:string}>  {
    try {
      const response = await this.AuthRepository.existUser(
        userData.email,
        userData.phone
      );
      if (response.existEmail) {
        throw new Error("Email already in use");
      }
      if (response.existPhone) {
        throw new Error("Phone already in use");
      }

      let saltRounds: number = 10;

      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const userId = uuidv4();
      this.userData = {
        userId: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        createdAt: new Date(),
      };
      const Generated_OTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      const hashedOTP: string = await bcrypt.hash(Generated_OTP, saltRounds);

      this.OTP = hashedOTP;

      let text = `Your OTP is ${Generated_OTP}`; 
      let subject = 'OTP Verification';

      const sendMailStatus: boolean = await sendMail(
        userData.email,
        subject,text
      );

      if (!sendMailStatus) {
        throw new Error("Otp not send");
      }
      const Generated_time = new Date();

      this.expiryOTP_time = new Date(Generated_time.getTime() + 60 * 1000);

      const token = jwt.sign(
        {
          userData: this.userData,
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

  async otpCheck(otp: string, token: string):Promise<{valid:boolean}> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      const tokenOTP = decoded.OTP;
      const expirationTime = new Date(decoded.expirationTime);
      const userData = decoded.userData;

      if (new Date() < expirationTime) {
        const result = await bcrypt.compare(otp, tokenOTP);
        if (result) {
          await this.AuthRepository.createUser(userData);

          return { valid: true };
        } else {
          throw new Error("Invalid OTP");
        }
      } else {
        throw new Error("OTP has expired");
      }
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }
  async verifyUser(email: string, password: string): Promise<GetUserData>  {
    try {
      const userData = await this.AuthRepository.userCheck(email);

      if (userData) {
        const result = await bcrypt.compare(password, userData.password);
        if (!result) {
          throw new Error("Password is wrong");
        }
        if (userData.isBlocked) {
          throw new Error("User is Blocked");
        }

        const accessToken = jwt.sign(
          { id: userData.userId, email: userData.email, role: "user" },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1hr",
          }
        );
        const refreshToken = jwt.sign(
          { id: userData.userId, email: userData.email, role: "user" },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );

        if (userData.image.url !== "") {
          const folderPath = this.getFolderPathByFileType(userData.image.type);
          const signedUrl = await this.S3Services.getFile(
            userData.image.url,
            folderPath
          );

          userData.image.url = signedUrl;
        }

        const userInfo = {
          name: userData.name,
          email: userData.email,
          userId: userData.userId,
          phone: userData.phone,
          isBlocked: userData.isBlocked,
          DOB: userData.DOB,
          address: userData.address,
          image: userData.image,
          _id: userData._id,
        };
        console.log("userInfo",userInfo);
        

        return {
          userInfo,
          accessToken,
          refreshToken,
        };
      } else {
        throw new Error("User Doesn't exist");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async resendOtpCheck(userToken: string): Promise<{token:string}> {
    try {
      const decoded: any = jwt.decode(userToken);

      const email = decoded.userData.email;

      const Generated_OTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      let saltRounds: number = 10;
      const hashedOTP: string = await bcrypt.hash(Generated_OTP, saltRounds);

      this.OTP = hashedOTP;
      console.log(Generated_OTP);
      
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
          userData: this.userData,
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

  

  private getFolderPathByFileType(fileType: string): string {
    switch (fileType) {
      case "profile image":
        return "eliteCare/doctorProfileImages";
      case "document":
        return "eliteCare/doctorDocuments";
      case "user profile image":
        return "eliteCare/userProfileImages";

      default:
        throw new Error(`Unknown file type: ${fileType}`);
    }
  }

  

  


  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  
}
