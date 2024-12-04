import {
  BookAppointment,
  GetAppointments,
  Slot,
} from "../../interface/userInterface/interface";
import dotenv from "dotenv";
import  { refund } from "../../config/stripeConfig";
import moment from "moment";
import { IAppointmentService } from "../../interface/user/Appointment.service.interface";
import { IAppointmentRepository } from "../../interface/user/Appointment.repository.interface";

dotenv.config();


export class AppointmentService implements IAppointmentService {
  
  private AppointmentRepository: IAppointmentRepository;
  

  constructor(AppointmentRepository: IAppointmentRepository) {
    this.AppointmentRepository = AppointmentRepository;
  }

  

  

  

  
  async checkSlotLocked(
    doctorId: string,
    slotId: Slot,
    date: string,
    userId: string
  ): Promise<boolean> {
    try {
      const availability = await this.AppointmentRepository.checkSlotAvailability(
        doctorId,
        slotId,
        date,
        userId
      );

      return availability;
    } catch (error: any) {
      console.error("Error in checkSlotLocked service:", error.message);
      throw new Error(error.message);
    }
  }
  

  async getAppointments(userId: string, status: string, page: number, limit: number): Promise<GetAppointments> {
    try {
        const response = await this.AppointmentRepository.getAllAppointments(userId, status, page, limit);

        if (response.appointments) {
            const updatedAppointments = response.appointments.map((appointment: any) => ({
                ...appointment,
                start: this.getTime(appointment.start),
                end: this.getTime(appointment.end),
            }));

            return { appointments: updatedAppointments, totalPages: response.totalPages };
        } else {
            console.error("Failed to get appointments: Response is invalid");
            throw new Error("Something went wrong while fetching the appointments.");
        }
    } catch (error: any) {
        console.error("Error in getAppointments:", error.message);
        throw new Error(`Failed to get appointments: ${error.message}`);
    }
}


  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  async cancelAppointment(appointmentId: string): Promise<BookAppointment|undefined> {
    try {
      const response = await this.AppointmentRepository.cancelAppointment(
        appointmentId
      );

      if (response) {
        const paymentId = response.paymentId;

        if (paymentId) {
          const refundResponse = await refund(paymentId, "cancelled by user");

          return response;
        } else {
          throw new Error("No payment ID available for refund");
        }
      }
    } catch (error: any) {
      console.error("Error in cancelAppointment:", error.message);
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }
  }
  async addReview(
    appointmentId: string,
    rating: number,
    review: string
  ): Promise<BookAppointment> {
    try {
      const response = await this.AppointmentRepository.addReview(
        appointmentId,
        rating,
        review
      );

      if (!response) {
        throw new Error("Appointment not found or review could not be added");
      }

      return response;
    } catch (error: any) {
      console.error("Error in addReview:", error.message);

      throw new Error(`Failed to add review: ${error.message}`);
    }
  }

  async getAppointment(appointmentId: string): Promise<BookAppointment> {
    try {
      const response = await this.AppointmentRepository.getAppointment(appointmentId);

      if (response) {
        const updatedAppointment = {
          ...response,
          start: this.getTime(response.start),
          end: this.getTime(response.end),
        };

        return updatedAppointment;
      } else {
        console.error("Failed to get appointment: Response is invalid");
        throw new Error("Something went wrong while fetching the appointment.");
      }
    } catch (error: any) {
      console.error("Error in getAppointment:", error.message);
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  }
}
