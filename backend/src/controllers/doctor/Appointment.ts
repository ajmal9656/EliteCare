import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IAppointmentService } from "../../interface/doctor/Appointment.service.interface";

export class AppointmentController {
  private AppointmentService: IAppointmentService;

  constructor(AppointmentServiceInstance: IAppointmentService) {
    this.AppointmentService = AppointmentServiceInstance;
  }

  

  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const { status = "All", page = "1", limit = "10", startDate, endDate } = req.query;
  
      // Check if startDate and endDate are provided and format them
      const start = startDate ? new Date(startDate as string) : null;
      const end = endDate ? new Date(endDate as string) : null;
  
      const response = await this.AppointmentService.getAppointments(
        doctorId,
        status as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        start,
        end
      );
  
      res.status(HTTP_statusCode.OK).json({
        message: "Appointments fetched successfully",
        data: response
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
      const { appointmentId, reason } = req.body;

     

      const response = await this.AppointmentService.cancelAppointment(
        appointmentId,
        reason
      );

    

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
  async addPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, prescription } = req.body;

     

      const response = await this.AppointmentService.addPrescription(
        appointmentId,
        prescription
      );

      

      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Prescription added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding prescription:", error.message);

      if (error.message.includes("Failed to add prescription")) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: `Failed to add prescription: ${error.message}` });
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


  async getMedicalRecords(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const response = await this.AppointmentService.getMedicalRecords(userId);

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
