import { DoctorFiles } from "../../interface/doctorInterface/doctorInterface";
import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IDoctorService } from "../../interface/doctor/Doctor.service.interface";

export class DoctorController {
  private DoctorService: IDoctorService;

  constructor(DoctorServiceInstance: IDoctorService) {
    this.DoctorService = DoctorServiceInstance;
  }

  async uploadDoctorData(req: Request, res: Response): Promise<void> {
    try {
      console.log("entered upload controller");
      
      const response = await this.DoctorService.uploadData(
        req.body,
        req.files as DoctorFiles
      );
      console.log("upload data controller",response);
      
      if (response) {
        res
          .status(HTTP_statusCode.OK)
          .json({ status: true, message: "Application Submitted" });
      } else {
        res.status(HTTP_statusCode.BadRequest).json({ status: false, message: "something wnt wrong" });
      }
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
 

  

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
        const doctorId = req.params.doctorId;
        const { status, page = 1, limit = 10 } = req.query;  // Default page 1, limit 10

        if (!doctorId) {
            res.status(HTTP_statusCode.BadRequest).json({ message: "Doctor ID is required." });
            return;
        }

        const response = await this.DoctorService.getWallet(
            doctorId,
            status as string,
            parseInt(page as string, 10), // Parse page to integer
            parseInt(limit as string, 10)  // Parse limit to integer
        );

        res.status(HTTP_statusCode.OK).json({
            success: true,
            message: "Wallet data fetched successfully",
            response,
        });
    } catch (error: any) {
        console.error("Error fetching wallet data:", error.message);

        if (error.message.includes("Failed to get wallet details")) {
            res.status(HTTP_statusCode.BadRequest).json({
                success: false,
                message: `Failed to get wallet details: ${error.message}`,
            });
        } else {
            res.status(HTTP_statusCode.InternalServerError).json({ success: false, message: "An unexpected error occurred." });
        }
    }
}


  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const withdrawalAmount = req.body.withdrawAmount;
     

      if (!doctorId) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ success: false, message: "Doctor ID is required." });
        return;
      }
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({
            success: false,
            message: "A valid withdrawal amount is required.",
          });
        return;
      }

      const response = await this.DoctorService.withdraw(
        doctorId,
        withdrawalAmount
      );

      res
        .status(HTTP_statusCode.OK)
        .json({ success: true, message: "Withdrawal successful", response });
    } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      if (error.message.includes("Failed to get wallet details")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({
            success: false,
            message: `Failed to get wallet details: ${error.message}`,
          });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }

  async getDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const reviewData = req.query.reviewData;
      

      const response = await this.DoctorService.getDoctorData(
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

  async updateDoctorProfile(req: Request, res: Response): Promise<void> {
    try {
      const { _id, fees, DOB, phone } = req.body;

      const response = await this.DoctorService.updateProfile(_id, {
        fees,
        DOB,
        phone,
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

  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.query.doctorId;
      const response = await this.DoctorService.getDashboardData(
        doctorId as string
      );

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Dashboard data retrieved successfully", response });
    } catch (error: any) {
      console.error("Error in getDashboardData controller:", error.message);

      if (
        error.message ===
        "Something went wrong while retrieving dashboard data."
      ) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "Failed to retrieve dashboard data." });
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

      const doctorId = req.body._id;
      if (!doctorId) {
        res.status(HTTP_statusCode.BadRequest).json({ message: "doctor ID is required." });
        return;
      }

      const response = await this.DoctorService.updateImage(doctorId, req.file);
      

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

  

  async getDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      
      const response = await this.DoctorService.doctorDetails(
        email);
       
        

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
}
