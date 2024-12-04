import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/HttpStatusCode";
import { ISlotService } from "../../interface/doctor/Slot.service.interface";

export class SlotController {
  private SlotService: ISlotService;

  constructor(SlotServiceInstance: ISlotService) {
    this.SlotService = SlotServiceInstance;
  }

 
  
  async createTimeSlot(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.SlotService.createSlot(req.body);

      res
        .status(HTTP_statusCode.OK)
        .json({
          status: true,
          message: "Slot created successfully",
          data: response,
        });
    } catch (error: any) {
      if (error.message === "Failed to create slot. No response received.") {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: "Failed to create slot. No response received." });
      } else {
        res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }
  async getTimeSlot(req: Request, res: Response): Promise<void> {
    try {
      const { date, doctorId } = req.query;

      if (!date || !doctorId) {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({
            message: "Missing required query parameters: date or doctorId",
          });
      }

      const response = await this.SlotService.getSlots(
        date as string,
        doctorId as string
      );

      res
        .status(HTTP_statusCode.OK)
        .json({
          status: true,
          message: "Slot retrieved successfully",
          data: response,
        });
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  async checkSlotAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { startDate,endDate, doctorId, timeSlots } = req.body;

      

      const response = await this.SlotService.checkAvailability(
        startDate as string,
        endDate as string,
        doctorId as string,
        timeSlots
      );

      res.status(HTTP_statusCode.OK).json({ status: true, data: response });
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId, date, doctorId } = req.query;

      if (!date || !doctorId || !slotId) {
        res.status(HTTP_statusCode.BadRequest).json({
          message:
            "Missing required query parameters: date, doctorId, or slotId",
        });
      }

      const parsedDate = new Date(date as string);

      const response = await this.SlotService.deleteSlot(
        parsedDate as Date,
        doctorId as string,
        slotId as string
      );

      res.status(HTTP_statusCode.OK).json({
        status: true,
        message: "Slot deleted successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("Error deleting slot:", error.message);

      res.status(HTTP_statusCode.InternalServerError).json({
        message: "Something went wrong, please try again later",
      });
    }
  }

  

 
}
