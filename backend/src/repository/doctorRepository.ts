import doctorModel from "../model/doctorModel";
import { Document } from "mongoose";
import { doctorType,DoctorData,DoctorFiles,docDetails } from "../interface/doctorInterface/doctorInterface";
import doctorApplicationModel from "../model/doctorApplicationModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";


export class doctorRepository {
    async existDoctor(email: string, phone: string): Promise<{ existEmail: boolean, existPhone: boolean }> {
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
            console.error('Error checking if user exists:', error);
            throw new Error('Error checking if user exists');
        }
    }

    async createDoctor(doctorData:doctorType):Promise<Document>{
        try {
        
            console.log(doctorData)
            const newDoctor = new doctorModel(doctorData);
            return await newDoctor.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }

    async doctorCheck(email: string) {
        try {
          console.log("login doctorrep");
          const doctorData = await doctorModel.findOne({ email: email });
      
          if (doctorData) {
            let result: any = doctorData; 
      
            if (doctorData.kycStatus === "rejected") {
              const rejectedData = await RejectDoctorModel.findOne({ doctorId: doctorData._id });
      
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
      
    async uploadDoctorData(data:DoctorData,docDetails:docDetails){
        try {
            
            
            const doctorData = await doctorModel.findOneAndUpdate({email:data.email},{kycStatus:"submitted"},{new:true});
            if(doctorData){
                const details = {
                    doctorId: doctorData._id, 
                    name: data.name, 
                    DOB: data.dob, 
                    department: data.department, 
                    gender: data.gender, 
                    image: docDetails.profileUrl, 
                    fees: data.fees, 
                    kycDetails: {
                        certificateImage: docDetails.certificateUrl, 
                        qualificationImage: docDetails.qualificationUrl, 
                        adharFrontImage: docDetails.aadhaarFrontImageUrl, 
                        adharBackImage: docDetails.aadhaarBackImageUrl, 
                        adharNumber: data.aadhaarNumber,
                    },
                    
                };
                console.log("doctorrep",details);

                const newDoctorApplication = await doctorApplicationModel.create(details);

                console.log("new",newDoctorApplication)

                return true

            }

            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
   
}
