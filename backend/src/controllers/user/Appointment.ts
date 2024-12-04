import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IAppointmentService } from "../../interface/user/Appointment.service.interface";
import { AppointmentService } from "../../services/user/Appointment";
import { Request, Response } from "express";

export class AppointmentController {
  private AppointmentService: IAppointmentService;

  constructor(AppointmentServiceInstance: AppointmentService) {
    this.AppointmentService = AppointmentServiceInstance;
  }



  
  async checkSlotStatus(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.body.doctorId;
      const slotId = req.body.slotId;
      const date = req.body.date;
      const userId = req.body.userId;

      const response = await this.AppointmentService.checkSlotLocked(
        doctorId,
        slotId,
        date,
        userId
      );

      res.status(HTTP_statusCode.OK).json({
        message: "Slot status retrieved successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("Error checking slot status:", error.message);

      if (error.message.includes("Slot is locked")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: "The selected slot is already locked." });
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
  

  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.params.userId;
        const { status, page = 1, limit = 4 } = req.query;

        // Fetch appointments using the userId, status, page, and limit
        const response = await this.AppointmentService.getAppointments(
            userId,
            status as string,
            Number(page),
            Number(limit)
        );

        res.status(HTTP_statusCode.OK).json({
            message: "Appointments fetched successfully",
            data: response.appointments,
            totalPages: response.totalPages
        });
    } catch (error: any) {
        console.error("Error fetching appointments:", error.message);

        if (error.message.includes("Failed to get appointments")) {
            res.status(HTTP_statusCode.BadRequest).json({ message: `Failed to get appointments: ${error.message}` });
        } else {
            res.status(HTTP_statusCode.InternalServerError).json({
                message: "An unexpected error occurred",
                error: error.message,
            });
        }
    }
}

  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;

      const response = await this.AppointmentService.cancelAppointment(appointmentId);

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Appointment canceled successfully", data: response });
    } catch (error: any) {
      console.error("Error canceling appointment:", error.message);

      if (error.message.includes("Failed to cancel appointment")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: `Failed to cancel appointment: ${error.message}` });
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
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, rating, reviewText } = req.body;

      const response = await this.AppointmentService.addReview(
        appointmentId,
        rating,
        reviewText
      );

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Review added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding review:", error.message);

      if (error.message.includes("Failed to add review")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: `Failed to add review: ${error.message}` });
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

  async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;

      const response = await this.AppointmentService.getAppointment(appointmentId);

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Appointment fetched successfully", data: response });
    } catch (error: any) {
      console.error(
        `Error fetching appointment with ID ${req.params.appointmentId}:`,
        error.message
      );

      if (error.message.includes("Failed to get appointments")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: `Failed to get appointments: ${error.message}` });
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
