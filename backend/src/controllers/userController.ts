import { IUserService } from "../interface/user.service.interface";
import { userService } from "../services/userService";
import { Request, Response } from "express";

export class userController {
  private userService: IUserService;

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

      const userOtp: string = req.body.otp;
      if (!userOtp) {
        res.status(400).json({ message: "OTP is required" });
        return;
      }
      console.log("otp", userOtp);

      const response = await this.userService.otpCheck(userOtp, token);
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
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const loginResponse = await this.userService.verifyUser(email, password);

      const response = {
        userInfo: loginResponse.userInfo,
      };
      res.cookie("RefreshToken", loginResponse.refreshToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        // secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "none", // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 21 days
      });
      res.cookie("AccessToken", loginResponse.accessToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        // secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "none", // Protects against CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: "Login successful", response });
    } catch (error: any) {
      if (error.message === "User Doesn't exist") {
        res.status(400).json({ message: "User Doesn't exist" });
      }
      if (error.message === "Password is wrong") {
        res.status(400).json({ message: "Password is wrong" });
      }
      if (error.message === "User is Blocked") {
        res.status(400).json({ message: "User is Blocked" });
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

      const response = await this.userService.resendOtpCheck(token);
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

  async getSpecializations(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.userService.getSpecialization();

      res
        .status(200)
        .json({ message: "Specialization fetched successfully", response });
    } catch (error: any) {
      if (error.message === `Failed to get specialization: ${error.message}`) {
        res
          .status(400)
          .json({ message: `Failed to get specialization: ${error.message}` });
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
  async getDoctorsWithSpecialization(req: Request, res: Response): Promise<void> {
    try {
      const { specializationId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = req.query.search as string || ''; // Get search query
  
      // Call the service to fetch doctors with the specialization and search query
      const response = await this.userService.getDoctorsWithSpecialization(specializationId, page, limit, search);
  
      // Return the response to the client
      res.status(200).json({
        message: "Fetched successfully",
        data: response.doctors,
        totalDoctors: response.totalDoctors,
        totalPages: Math.ceil(response.totalDoctors / limit),
        currentPage: page,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
  
  async getDoctors(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      

      const response = await this.userService.getDoctors();

      res.status(200).json({ message: "Fetched successfully", response });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: "An unexpected error occurred",
          error: error.message,
        });
    }
  }
  async getDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const reviewData = req.query.reviewData;

      const response = await this.userService.getDoctorData(
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
  async getDoctorSlots(req: Request, res: Response): Promise<void> {
    try {
      const { date, doctorId } = req.query;

      if (!date || !doctorId) {
        res.status(400).json({ message: "Date and doctorId are required." });
      }

      const response = await this.userService.getSlots(
        date as string,
        doctorId as string
      );

      res
        .status(200)
        .json({ message: "Doctor slots fetched successfully", response });
    } catch (error: any) {
      if (error.message.includes("something went wrong")) {
        res.status(400).json({ message: "Error fetching doctor slots." });
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
  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      

      const response = await this.userService.getUserData(
        userId
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
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { _id, name, DOB, address } = req.body;

      const response = await this.userService.updateProfile(_id, {
        name,
        DOB,
        address,
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
  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No image file provided." });
        return;
      }

      const userId = req.body._id;
      if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
      }

      const response = await this.userService.updateImage(userId, req.file);

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
  async checkSlotStatus(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.body.doctorId;
      const slotId = req.body.slotId;
      const date = req.body.date;
      const userId = req.body.userId;

      const response = await this.userService.checkSlotLocked(
        doctorId,
        slotId,
        date,
        userId
      );

      res.status(200).json({
        message: "Slot status retrieved successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("Error checking slot status:", error.message);

      if (error.message.includes("Slot is locked")) {
        res
          .status(400)
          .json({ message: "The selected slot is already locked." });
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
  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { appointment } = req.body;

      const session = await this.userService.createSession(appointment);

      res.status(200).json({
        message: "Checkout session created successfully",
        session,
      });
    } catch (error: any) {
      console.error("Error checking slot statusssss:", error.message);

      if (error.message === "Session Timed Out") {
        res.status(409).json({ message: "Session Timed out" });
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
  async confirmPayment(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.body;

      const confirmAppointment = await this.userService.confirmAppointment(
        appointmentId
      );

      res.status(200).json({
        message: "Checkout response created successfully",
        confirmAppointment,
      });
    } catch (error: any) {
      console.error("Error checking slot status:", error.message);

      if (error.message == "Session Timed Out") {
        res.status(409).json({ message: "Session Timed Out" });
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

  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.params.userId;
        const { status, page = 1, limit = 4 } = req.query;

        // Fetch appointments using the userId, status, page, and limit
        const response = await this.userService.getAppointments(
            userId,
            status as string,
            Number(page),
            Number(limit)
        );

        res.status(200).json({
            message: "Appointments fetched successfully",
            data: response.appointments,
            totalPages: response.totalPages
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
      const appointmentId = req.params.appointmentId;

      const response = await this.userService.cancelAppointment(appointmentId);

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
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, rating, reviewText } = req.body;

      const response = await this.userService.addReview(
        appointmentId,
        rating,
        reviewText
      );

      res
        .status(200)
        .json({ message: "Review added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding review:", error.message);

      if (error.message.includes("Failed to add review")) {
        res
          .status(400)
          .json({ message: `Failed to add review: ${error.message}` });
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

  async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;

      const response = await this.userService.getAppointment(appointmentId);

      res
        .status(200)
        .json({ message: "Appointment fetched successfully", data: response });
    } catch (error: any) {
      console.error(
        `Error fetching appointment with ID ${req.params.appointmentId}:`,
        error.message
      );

      if (error.message.includes("Failed to get appointments")) {
        res
          .status(400)
          .json({ message: `Failed to get appointments: ${error.message}` });
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
