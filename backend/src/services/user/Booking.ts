import {
  BookAppointment,
  
} from "../../interface/userInterface/interface";
import dotenv from "dotenv";
import { Appointment } from "../../interface/userInterface/interface";
import makeThePayment, { refund } from "../../config/stripeConfig";
import moment from "moment";
import { IBookingService } from "../../interface/user/Booking.service.interface";
import { IBookingRepository } from "../../interface/user/Booking.repository.interface";
import { BookingRepository } from "../../repository/user/Booking";

dotenv.config();


export class BookingService implements IBookingService {
 
  private BookingRepository: IBookingRepository;
  

  constructor(BookingRepository: BookingRepository) {
    this.BookingRepository = BookingRepository;
  }

  

  

  

  
  
  async createSession(appointmentData: Appointment): Promise<any> {
    try {
      const data = {
        doctor: appointmentData.doctor,
        slot: appointmentData.slot,
        date: appointmentData.date,
        image: appointmentData.doctor.signedImageUrl,
      };
      const patientData = {
        patientName: appointmentData.patientName,
        age: parseInt(appointmentData.age),
        description: appointmentData.description,
        doctor: appointmentData.doctor,
        slot: appointmentData.slot,
        date: appointmentData.date,
        image: appointmentData.doctor.signedImageUrl,
        userId: appointmentData.userId,
      };
      const appointment = await this.BookingRepository.createAppointment(
        patientData
      );

      if (appointment) {
        const session = await makeThePayment(data, appointment._id);
        if (session) {
          const updateAppointment = await this.BookingRepository.updateAppointment(
            session.id,
            appointment._id
          );
          console.log("session",session);
          

          return session;
        }
      }
    } catch (error: any) {
      console.error("Error in createSession servicessss:", error.message);
      throw new Error(error.message);
    }
  }
  async confirmAppointment(appointmentId: string): Promise<BookAppointment|null> {
    try {
      const confirmAppointment =
        await this.BookingRepository.confirmAppointmentPayment(appointmentId);

      return confirmAppointment;
    } catch (error: any) {
      console.error("Error in createSession service:", error.message);
      throw new Error(error.message);
    }
  }

  


  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

 
}
