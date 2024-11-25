import { doctorRepository } from "../repository/doctorRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  doctorType,
  DoctorData,
  DoctorFiles,
  docDetails,
  TimeSlot,
  doctorImage,
  FileData,
  DoctorResult,
  IDoctorInfo,
  DoctorSchedule,
  Slot,
  GetAppointmentData,
  AppointmentData,
  GetTransactionData,
  IDoctor,
  IDoctorInformation,
  IDashboardStats,
  IDoctorImageInfo,
  IMedicalReport,
} from "../interface/doctorInterface/doctorInterface";
import { S3Service } from "../config/s3client";
import moment from "moment";
import { refund } from "../config/stripeConfig";
import { cropAndSave } from "../helper/sharp";
import sharp from "sharp";
import { IWallet } from "../model/walletModel";
import { IDoctorRepository } from "../interface/doctor.repository.interface";

dotenv.config();

export class doctorService {
  private doctorRepository: IDoctorRepository;
  private OTP: string | null = null;
  private expiryOTP_time: Date | null = null;
  private doctorData: doctorType | null = null;
  private S3Service: S3Service;

  constructor(
    doctorRepository:IDoctorRepository,
    S3ServiceInstance: S3Service
  ) {
    this.doctorRepository = doctorRepository;
    this.S3Service = S3ServiceInstance;
  }

  async signup(doctorData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<{token:string}> {
    try {
      const response = await this.doctorRepository.existDoctor(
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

      const sendMailStatus: boolean = await sendMail(
        doctorData.email,
        Generated_OTP
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
          await this.doctorRepository.createDoctor(doctorData);

          return { valid: true };
        } else {
          console.log("error");
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

      const sendMailStatus: boolean = await sendMail(email, Generated_OTP);

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
      const doctorData = await this.doctorRepository.doctorCheck(email);
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
  async uploadData(data: DoctorData, files: DoctorFiles): Promise<boolean|undefined> {
    try {
      const docDetails: docDetails = {
        profileUrl: {
          type: "",
          url: "",
        },
        aadhaarFrontImageUrl: {
          type: "",
          url: "",
        },
        aadhaarBackImageUrl: {
          type: "",
          url: "",
        },
        certificateUrl: {
          type: "",
          url: "",
        },
        qualificationUrl: {
          type: "",
          url: "",
        },
      };

      if (files.image) {
        const profileUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorProfileImages/",
          files.image[0]
        );
        docDetails.profileUrl.url = profileUrl;
        docDetails.profileUrl.type = "profile image";
      }
      if (files.aadhaarFrontImage) {
        const aadhaarFrontImageUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.aadhaarFrontImage[0]
        );
        docDetails.aadhaarFrontImageUrl.url = aadhaarFrontImageUrl;
        docDetails.aadhaarFrontImageUrl.type = "document";
      }
      if (files.aadhaarBackImage) {
        const aadhaarBackImageUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.aadhaarBackImage[0]
        );
        docDetails.aadhaarBackImageUrl.url = aadhaarBackImageUrl;
        docDetails.aadhaarBackImageUrl.type = "document";
      }
      if (files.certificateImage) {
        const certificateUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.certificateImage[0]
        );
        docDetails.certificateUrl.url = certificateUrl;
        docDetails.certificateUrl.type = "document";
      }
      if (files.qualificationImage) {
        const qualificationUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.qualificationImage[0]
        );
        docDetails.qualificationUrl.url = qualificationUrl;
        docDetails.qualificationUrl.type = "document";
      }

      const response = await this.doctorRepository.uploadDoctorData(
        data,
        docDetails
      );
      if (response) {
        return response;
      }
    } catch (error: any) {
      console.log("service error");
      throw new Error(error.message);
    }
  }
  async createSlot(data: TimeSlot): Promise<DoctorSchedule> {
    try {
      const response = await this.doctorRepository.createSlot(data);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to create slot. No response received.");
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async getSlots(date: string, doctorId: string): Promise<Slot[]> {
    try {
      const response = await this.doctorRepository.getSlots(date, doctorId);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to retrieve slot. No response received.");
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async checkAvailability(
    date: string,
    doctorId: string,
    start: string,
    end: string
  ): Promise<boolean> {
    try {
      const response = await this.doctorRepository.checkSlots(
        date,
        doctorId,
        start,
        end
      );

      if (response) {
        return response;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error("Service error:", error.message);
      throw new Error(error.message);
    }
  }
  async deleteSlot(date: Date, doctorId: string, slotId: string): Promise<boolean> {
    try {
      const response = await this.doctorRepository.deleteTimeSlot(
        date,
        doctorId,
        slotId
      );

      if (response) {
        return response;
      } else {
        throw new Error(
          "Failed to delete slot. No response received from the repository."
        );
      }
    } catch (error: any) {
      throw new Error(`Error deleting slot: ${error.message}`);
    }
  }

  async getAppointments(
    doctorId: string,
    status: string,
    page: number = 1,
    limit: number = 10,
    startDate: Date | null = null,
    endDate: Date | null = null
  ): Promise<GetAppointmentData> {
    try {
      const response = await this.doctorRepository.getAllAppointments(
        doctorId,
        status,
        page,
        limit,
        startDate,
        endDate
      );
  
      if (response && Array.isArray(response.appointments)) {
        const formattedAppointments = response.appointments.map((appointment:any) => {
          return {
            ...appointment,
            start: this.getTime(appointment.start),
            end: this.getTime(appointment.end),
          };
        });
  
        return {
          appointments: formattedAppointments,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          totalAppointments: response.totalAppointments,
        };
      } else {
        console.error("Failed to get appointments: Response is invalid", response);
        throw new Error("Something went wrong while fetching the appointments.");
      }
    } catch (error: any) {
      console.error("Error in getAppointments:", error.stack || error.message);
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
  }
  


  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  async cancelAppointment(appointmentId: string, reason: string): Promise<AppointmentData> {
    try {
      const response = await this.doctorRepository.cancelAppointment(
        appointmentId,
        reason
      );

      if (response) {
        

        const paymentId = response.paymentId;

        if (paymentId) {
          

          const refundResponse = await refund(paymentId, "cancelled by doctor");

          return response;
        } else {
          throw new Error("No payment ID available for refund");
        }
      } else {
        throw new Error("Failed to cancel the appointment: Invalid response");
      }
    } catch (error: any) {
      console.error("Error in cancelAppointment:", error.message);
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }
  }
  async addPrescription(
    appointmentId: string,
    prescription: string
  ): Promise<AppointmentData> {
    try {
      const response = await this.doctorRepository.completeAppointment(
        appointmentId,
        prescription
      );

      if (response) {
        return response;
      } else {
        throw new Error(
          "Failed to complete the appointment: Invalid response from repository"
        );
      }
    } catch (error: any) {
      console.error("Error in addPrescription:", error.message);
      throw new Error(`Failed to add prescription: ${error.message}`);
    }
  }

  async getWallet(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData> {
    try {
        const response = await this.doctorRepository.getWalletDetails(
            doctorId,
            status,
            page,
            limit
        );
        return response;
    } catch (error: any) {
        console.error("Error in getWallet:", error.stack || error.message);
        throw new Error(`Failed to get wallet details: ${error.message}`);
    }
}

  async withdraw(doctorId: string, withdrawalAmount: number): Promise<IWallet> {
    try {
      const response = await this.doctorRepository.withdrawMoney(
        doctorId,
        withdrawalAmount
      );

      return response;
    } catch (error: any) {
      console.error("Error in withdraw:", error.stack || error.message);
      throw new Error(`Failed to withdraw: ${error.message}`);
    }
  }

  async getDoctorData(doctorId: string, reviewData: any): Promise<IDoctor|undefined> {
    try {
      const response = await this.doctorRepository.getDoctor(
        doctorId,
        reviewData
      );

      if (response?.image && response.image.url && response.image.type) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Service.getFile(
          response.image.url,
          folderPath
        );

        return {
          ...response,
          signedImageUrl: signedUrl,
        };
      }
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
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

  async updateProfile(
    _id: string,
    updateData: { fees: number; DOB: Date; phone: string }
  ): Promise<{doctorInfo:IDoctorInformation}> {
    try {
      const updatedDoctor = await this.doctorRepository.updateProfile(
        _id,
        updateData
      );

      if (updatedDoctor.image != null) {
        const folderPath = this.getFolderPathByFileType(
          updatedDoctor.image.type
        );
        const signedUrl = await this.S3Service.getFile(
          updatedDoctor.image.url,
          folderPath
        );

        updatedDoctor.image.url = signedUrl;
      }

      const doctorInfo = {
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        doctorId: updatedDoctor._id,
        phone: updatedDoctor.phone,
        isBlocked: updatedDoctor.isBlocked,
        DOB: updatedDoctor.DOB,
        fees: updatedDoctor.fees,
        image: updatedDoctor.image,
      };

      return { doctorInfo };
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getDashboardData(doctorId: string): Promise<IDashboardStats> {
    try {
      

      const response = await this.doctorRepository.getAllStatistics(
        doctorId as string
      );

      if (response) {
        
        return response;
      } else {
        console.error("Failed to retrieve dashboard data: Response is invalid");
        throw new Error(
          "Something went wrong while retrieving dashboard data."
        );
      }
    } catch (error: any) {
      console.error("Error in getDashboardData:", error.message);
      throw new Error(`Failed to retrieve dashboard data: ${error.message}`);
    }
  }

  async updateImage(userID: string, file: FileData): Promise<{doctorInfo:IDoctorImageInfo}> {
    try {
      const doctorProfileImage: doctorImage = {
        profileUrl: {
          type: "",
          url: "",
        },
      };

      if (file) {
        

        // Load the image buffer into sharp and get metadata
        const image = await sharp(file.buffer);
        const metadata = await image.metadata();

        const width = metadata.width;
        const height = metadata.height;

        // Check if width and height are defined
        if (width === undefined || height === undefined) {
          throw new Error("Image metadata could not be retrieved.");
        }

        // Calculate the size and position for cropping
        const squareSize = Math.min(width, height); // Ensuring the crop is square
        const x = (width - squareSize) / 2; // X position for cropping (centered)
        const y = (height - squareSize) / 2; // Y position for cropping (centered)

        // Crop the image into a square
        const croppedBuffer = await cropAndSave(
          x,
          y,
          squareSize,
          squareSize,
          file.buffer
        );

        file.buffer = croppedBuffer;
        const profileUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorProfileImages/",
          file
        );
        doctorProfileImage.profileUrl.url = profileUrl;
        doctorProfileImage.profileUrl.type = "profile image";
      }

      const response = await this.doctorRepository.uploadProfileImage(
        userID,
        doctorProfileImage
      );
      if (response) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Service.getFile(
          response.image.url,
          folderPath
        );

        const doctorInfo = {
          name: response.name,
          email: response.email,
          doctorId: response._id,
          phone: response.phone,
          isBlocked: response.isBlocked,
          DOB: response.DOB,
          fees: response.fees,
          image: signedUrl,
        };

        console.log("docccccccccccccc",doctorInfo);
        

        return { doctorInfo };
      }else{
        throw new Error("Image metadata could not be retrieved.");

      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getMedicalRecords(userId: string): Promise<IMedicalReport[]> {
    try {
      const response = await this.doctorRepository.getMedicalRecords(userId);

      return response;
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }
}
