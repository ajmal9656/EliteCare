import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IUserService } from "../../interface/user/User.service.interface"; 
import { Request, Response } from "express";

export class UserController {
  private userService: IUserService;

  constructor(userServiceInstance: IUserService) {
    this.userService = userServiceInstance;
  }



  async getSpecializations(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.userService.getSpecialization();

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Specialization fetched successfully", response });
    } catch (error: any) {
      if (error.message === `Failed to get specialization: ${error.message}`) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: `Failed to get specialization: ${error.message}` });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
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
      res.status(HTTP_statusCode.OK).json({
        message: "Fetched successfully",
        data: response.doctors,
        totalDoctors: response.totalDoctors,
        totalPages: Math.ceil(response.totalDoctors / limit),
        currentPage: page,
      });
    } catch (error: any) {
      res.status(HTTP_statusCode.InternalServerError).json({
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

      res.status(HTTP_statusCode.OK).json({ message: "Fetched successfully", response });
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
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

      res.status(HTTP_statusCode.OK).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({
            message: "Something went wrong while creating the specialization.",
          });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
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
        res.status(HTTP_statusCode.BadRequest).json({ message: "Date and doctorId are required." });
      }

      const response = await this.userService.getSlots(
        date as string,
        doctorId as string
      );

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Doctor slots fetched successfully", response });
    } catch (error: any) {
      if (error.message.includes("something went wrong")) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Error fetching doctor slots." });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
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

      res.status(HTTP_statusCode.OK).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({
            message: "Something went wrong while creating the specialization.",
          });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
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
        .status(HTTP_statusCode.OK)
        .json({ message: "Profile updated successfully", response });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);

      if (error.message.includes("something went wrong")) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Error updating profile." });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
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
        res.status(HTTP_statusCode.BadRequest).json({ message: "No image file provided." });
        return;
      }

      const userId = req.body._id;
      if (!userId) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "User ID is required." });
        return;
      }

      const response = await this.userService.updateImage(userId, req.file);

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Profile image updated successfully", response });
    } catch (error: any) {
      console.error("Error updating profile Image:", error.message);

      if (error.message.includes("something went wrong")) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Error updating profile image." });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({
            message: "An unexpected error occurred",
            error: error.message,
          });
      }
    }
  }
 
}
