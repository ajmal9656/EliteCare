import dotenv from "dotenv";
import {
  GetAppointmentData,
  AppointmentData,
  IMedicalReport,
} from "../../interface/doctorInterface/doctorInterface";
import moment from "moment";
import { refund } from "../../config/stripeConfig";
import { IAppointmentRepository } from "../../interface/doctor/Appointment.repository.interface";
import { IAppointmentService } from "../../interface/doctor/Appointment.service.interface";

dotenv.config();

export class AppointmentService implements IAppointmentService {
  private AppointmentRepository: IAppointmentRepository;
  

  constructor(
    AppointmentRepository:IAppointmentRepository,
   
  ) {
    this.AppointmentRepository = AppointmentRepository;
    
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
      const response = await this.AppointmentRepository.getAllAppointments(
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
      const response = await this.AppointmentRepository.cancelAppointment(
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
      const response = await this.AppointmentRepository.completeAppointment(
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

  

  

  async getMedicalRecords(userId: string): Promise<IMedicalReport[]> {
    try {
      const response = await this.AppointmentRepository.getMedicalRecords(userId);

      return response;
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }

  
}
