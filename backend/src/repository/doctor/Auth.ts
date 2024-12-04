import doctorModel from "../../model/doctorModel";
import{ Document} from "mongoose";
import {
  doctorType,
  DoctorResult,
  
} from "../../interface/doctorInterface/doctorInterface";
import RejectDoctorModel from "../../model/RejectDoctorSchema";
import { IAuthRepository } from "../../interface/doctor/Auth.repository.interface";



export class AuthRepository implements IAuthRepository{
  async existDoctor(
    email: string,
    phone: string
  ): Promise<{ existEmail: boolean; existPhone: boolean }> {
    try {
      let existEmail = true;
      let existPhone = true;

      const emailExist = await doctorModel.findOne({ email: email });
      if (!emailExist) {
        existEmail = false;
      }

      const phoneExist = await doctorModel.findOne({ phone: phone });
      if (!phoneExist) {
        existPhone = false;
      }

      return { existEmail, existPhone };
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw new Error("Error checking if user exists");
    }
  }

  async createDoctor(doctorData: doctorType): Promise<Document> {
    try {
      const newDoctor = new doctorModel(doctorData);
      return await newDoctor.save();
    } catch (error: any) {
      console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
    }
  }

  async doctorCheck(email: string): Promise<DoctorResult> {
    try {
      const doctorData = await doctorModel.findOne({ email: email });

      if (doctorData) {
        let result: any = doctorData;

        if (doctorData.kycStatus === "rejected") {
          const rejectedData = await RejectDoctorModel.findOne({
            doctorId: doctorData._id,
          });

          if (rejectedData) {
            result.rejectedReason = rejectedData.reason;
          }
        }

       
        

        return result;
      }

      throw new Error("Doctor Doesn't exist");
    } catch (error: any) {
      console.log("rep error");
      throw new Error(error.message);
    }
  }

  
  

  

  

  
  
  

  
  
  


 

  

  
  
  
}
