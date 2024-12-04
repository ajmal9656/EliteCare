import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IBookingService } from "../../interface/user/Booking.service.interface";
import { BookingService } from "../../services/user/Booking";
import { Request, Response } from "express";

export class BookingController {
  private BookingService: IBookingService;

  constructor(BookingServiceInstance: BookingService) {
    this.BookingService = BookingServiceInstance;
  }



  
  
  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { appointment } = req.body;

      const session = await this.BookingService.createSession(appointment);

      res.status(HTTP_statusCode.OK).json({
        message: "Checkout session created successfully",
        session,
      });
    } catch (error: any) {
      console.error("Error checking slot statusssss:", error.message);

      if (error.message === "Session Timed Out") {
        res.status(HTTP_statusCode.Conflict).json({ message: "Session Timed out" });
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
  async confirmPayment(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.body;

      const confirmAppointment = await this.BookingService.confirmAppointment(
        appointmentId
      );

      res.status(HTTP_statusCode.OK).json({
        message: "Checkout response created successfully",
        confirmAppointment,
      });
    } catch (error: any) {
      console.error("Error checking slot status:", error.message);

      if (error.message == "Session Timed Out") {
        res.status(HTTP_statusCode.Conflict).json({ message: "Session Timed Out" });
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
