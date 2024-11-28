import { doctorService } from "../services/doctorService";
import { DoctorFiles } from "../interface/doctorInterface/doctorInterface";
import { S3Service } from "../config/s3client";
import { Request, Response } from "express";
import { IDoctorService } from "../interface/doctor.service.interface";

export class doctorController {
  private doctorService: IDoctorService;

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
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
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
      console.log("otppp", doctorOtp);

      const response = await this.doctorService.otpCheck(doctorOtp, token);
      if (response.valid) {
        res
          .status(200)
          .json({ status: true, message: "OTP verified successfully" });
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
      } else if (error.message === "OTP has expired") {
        res.status(401).json({ message: "Token has expired" });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  async loginDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const loginResponse = await this.doctorService.verifyDoctor(
        email,
        password
      );

      const response = {
        doctorInfo: loginResponse.doctorInfo,
      };

      res.cookie("RefreshToken", loginResponse.refreshToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 21 days
      });
      res.cookie("AccessToken", loginResponse.accessToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: "Login successful", response });
    } catch (error: any) {
      if (error.message === "Doctor Doesn't exist") {
        res.status(400).json({ message: "Doctor Doesn't exist" });
      }
      if (error.message === "Password is wrong") {
        res.status(400).json({ message: "Password is wrong" });
      }
      if (error.message === "Doctor is Blocked") {
        res.status(400).json({ message: "Doctor is Blocked" });
      }
    }
  }
  async logoutDoctor(req: Request, res: Response): Promise<void> {
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
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
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
        res
          .status(200)
          .json({
            status: true,
            message: "OTP Resended successfully",
            response,
          });
      } else {
        res.status(400).json({ status: false, message: "something wnt wrong" });
      }
    } catch (error: any) {
      if (error.message === "Otp not send") {
        res.status(500).json({ message: "OTP not sent" });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }
  async uploadDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.doctorService.uploadData(
        req.body,
        req.files as DoctorFiles
      );
      if (response) {
        res
          .status(200)
          .json({ status: true, message: "Application Submitted" });
      } else {
        res.status(400).json({ status: false, message: "something wnt wrong" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  async createTimeSlot(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.doctorService.createSlot(req.body);

      res
        .status(200)
        .json({
          status: true,
          message: "Slot created successfully",
          data: response,
        });
    } catch (error: any) {
      if (error.message === "Failed to create slot. No response received.") {
        res
          .status(500)
          .json({ message: "Failed to create slot. No response received." });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }
  async getTimeSlot(req: Request, res: Response): Promise<void> {
    try {
      const { date, doctorId } = req.query;

      if (!date || !doctorId) {
        res
          .status(400)
          .json({
            message: "Missing required query parameters: date or doctorId",
          });
      }

      const response = await this.doctorService.getSlots(
        date as string,
        doctorId as string
      );

      res
        .status(200)
        .json({
          status: true,
          message: "Slot retrieved successfully",
          data: response,
        });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  async checkSlotAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { date, doctorId, start, end } = req.body;

      if (!date || !doctorId) {
        res
          .status(400)
          .json({
            message: "Missing required query parameters: date or doctorId",
          });
      }

      const response = await this.doctorService.checkAvailability(
        date as string,
        doctorId as string,
        start as string,
        end as string
      );

      res.status(200).json({ status: true, data: response });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId, date, doctorId } = req.query;

      if (!date || !doctorId || !slotId) {
        res.status(400).json({
          message:
            "Missing required query parameters: date, doctorId, or slotId",
        });
      }

      const parsedDate = new Date(date as string);

      const response = await this.doctorService.deleteSlot(
        parsedDate as Date,
        doctorId as string,
        slotId as string
      );

      res.status(200).json({
        status: true,
        message: "Slot deleted successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("Error deleting slot:", error.message);

      res.status(500).json({
        message: "Something went wrong, please try again later",
      });
    }
  }

  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const { status = "All", page = "1", limit = "10", startDate, endDate } = req.query;
  
      // Check if startDate and endDate are provided and format them
      const start = startDate ? new Date(startDate as string) : null;
      const end = endDate ? new Date(endDate as string) : null;
  
      const response = await this.doctorService.getAppointments(
        doctorId,
        status as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        start,
        end
      );
  
      res.status(200).json({
        message: "Appointments fetched successfully",
        data: response
      });
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);
      if (error.message.includes("Failed to get appointments")) {
        res.status(400).json({ message: `Failed to get appointments: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }
  


  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, reason } = req.body;

      console.log("Received appointmentId:", appointmentId);
      console.log("Received Reason:", reason);

      const response = await this.doctorService.cancelAppointment(
        appointmentId,
        reason
      );

      console.log("Cancel Appointment Response:", response);

      res
        .status(200)
        .json({ message: "Appointment canceled successfully", data: response });
    } catch (error: any) {
      console.error("Error canceling appointment:", error.message);

      if (error.message.includes("Failed to cancel appointment")) {
        res
          .status(400)
          .json({ message: `Failed to cancel appointment: ${error.message}` });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }
  async addPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, prescription } = req.body;

      console.log("Received appointmentId:", appointmentId);
      console.log("Received prescription:", prescription);

      const response = await this.doctorService.addPrescription(
        appointmentId,
        prescription
      );

      console.log("Add Prescription Response:", response);

      res
        .status(200)
        .json({ message: "Prescription added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding prescription:", error.message);

      if (error.message.includes("Failed to add prescription")) {
        res
          .status(400)
          .json({ message: `Failed to add prescription: ${error.message}` });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
        const doctorId = req.params.doctorId;
        const { status, page = 1, limit = 10 } = req.query;  // Default page 1, limit 10

        if (!doctorId) {
            res.status(400).json({ message: "Doctor ID is required." });
            return;
        }

        const response = await this.doctorService.getWallet(
            doctorId,
            status as string,
            parseInt(page as string, 10), // Parse page to integer
            parseInt(limit as string, 10)  // Parse limit to integer
        );

        res.status(200).json({
            success: true,
            message: "Wallet data fetched successfully",
            response,
        });
    } catch (error: any) {
        console.error("Error fetching wallet data:", error.message);

        if (error.message.includes("Failed to get wallet details")) {
            res.status(400).json({
                success: false,
                message: `Failed to get wallet details: ${error.message}`,
            });
        } else {
            res.status(500).json({ success: false, message: "An unexpected error occurred." });
        }
    }
}


  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const withdrawalAmount = req.body.withdrawAmount;
      console.log(req.body);
      console.log(withdrawalAmount);
      console.log(typeof withdrawalAmount);

      if (!doctorId) {
        res
          .status(400)
          .json({ success: false, message: "Doctor ID is required." });
        return;
      }
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        res
          .status(400)
          .json({
            success: false,
            message: "A valid withdrawal amount is required.",
          });
        return;
      }

      const response = await this.doctorService.withdraw(
        doctorId,
        withdrawalAmount
      );

      res
        .status(200)
        .json({ success: true, message: "Withdrawal successful", response });
    } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      if (error.message.includes("Failed to get wallet details")) {
        res
          .status(400)
          .json({
            success: false,
            message: `Failed to get wallet details: ${error.message}`,
          });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }

  async getDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const reviewData = req.query.reviewData;
      console.log("revi", doctorId);

      const response = await this.doctorService.getDoctorData(
        doctorId,
        reviewData
      );

      res.status(200).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res
          .status(400)
          .json({
            message: "Something went wrong while creating the specialization.",
          });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async updateDoctorProfile(req: Request, res: Response): Promise<void> {
    try {
      const { _id, fees, DOB, phone } = req.body;

      const response = await this.doctorService.updateProfile(_id, {
        fees,
        DOB,
        phone,
      });

      res
        .status(200)
        .json({ message: "Profile updated successfully", response });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);

      if (error.message.includes("something went wrong")) {
        res.status(400).json({ message: "Error updating profile." });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.query.doctorId;
      const response = await this.doctorService.getDashboardData(
        doctorId as string
      );

      res
        .status(200)
        .json({ message: "Dashboard data retrieved successfully", response });
    } catch (error: any) {
      console.error("Error in getDashboardData controller:", error.message);

      if (
        error.message ===
        "Something went wrong while retrieving dashboard data."
      ) {
        res.status(400).json({ message: "Failed to retrieve dashboard data." });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No image file provided." });
        return;
      }

      const doctorId = req.body._id;
      if (!doctorId) {
        res.status(400).json({ message: "doctor ID is required." });
        return;
      }

      const response = await this.doctorService.updateImage(doctorId, req.file);
      console.log("image res", response);

      res
        .status(200)
        .json({ message: "Profile image updated successfully", response });
    } catch (error: any) {
      console.error("Error updating profile Image:", error.message);

      if (error.message.includes("something went wrong")) {
        res.status(400).json({ message: "Error updating profile image." });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async getMedicalRecords(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const response = await this.doctorService.getMedicalRecords(userId);

      res.status(200).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res
          .status(400)
          .json({
            message: "Something went wrong while creating the specialization.",
          });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }

  async getDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      
      const response = await this.doctorService.doctorDetails(
        email);
        console.log("redd",response);
        

      res.status(200).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res
          .status(400)
          .json({
            message: "Something went wrong while creating the specialization.",
          });
      } else {
        res
          .status(500)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }
}
