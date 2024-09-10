import userModel from "../model/userModel";
import { userType } from "../interface/interface";
import { Document } from "mongoose";
import specializationModel from "../model/SpecializationModel";
import doctorModel from "../model/doctorModel";
import mongoose from "mongoose";


const ObjectId = mongoose.Types.ObjectId;


export class userRepository {
    async existUser(email: string, phone: string): Promise<{ existEmail: boolean, existPhone: boolean }> {
        try {
        
            let existEmail = true;
            let existPhone = true;

           
            const emailExist = await userModel.findOne({ email: email });
            if (!emailExist) {
                existEmail = false;
            }

            
            const phoneExist = await userModel.findOne({ phone: phone });
            if (!phoneExist) {
                existPhone = false;
            }

            
            return { existEmail, existPhone };

        } catch (error) {
            console.error('Error checking if user exists:', error);
            throw new Error('Error checking if user exists');
        }
    }
    async createUser(userData:userType):Promise<Document>{
        try {
        
            console.log(userData)
            const newUser = new userModel(userData);
            return await newUser.save()

             
            
        } catch (error:any) {
            console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
        }
    }
    async userCheck(email:string){
        try {
            console.log("login userrep");
            const userData = await userModel.findOne({email:email})
            if(userData){
                return userData
            }
            throw new Error("User Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
    async getAllSpecialization(){
        try {
            
            const specializations = await specializationModel.find({isListed:true})
    
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllDoctorsWithSpecialization(specializationId: string) {
        try {
            console.log(specializationId)
          const doctors = await doctorModel
            .find(
              { department: new ObjectId(specializationId), isBlocked: false },
              {
                name: 1,
                _id: 1,
                doctorId: 1,
                email: 1,
                department: 1,
                fees: 1,
                image: 1,
              }
            )
            .populate('department','name').lean() 

        console.log(specializationId, "dd");
        

            
      
          return doctors;
        } catch (error: any) {
          console.error("Error getting doctors with specialization:", error.message);
          throw new Error(`Failed to fetch doctors for specialization ${specializationId}: ${error.message}`);
        }
      }
      
}
