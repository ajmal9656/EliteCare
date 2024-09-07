import { Document } from "mongoose";
import adminModel from "../model/adminModel";
import { Console } from "console";
import specializationModel from "../model/SpecializationModel";
import doctorApplicationModel from "../model/doctorApplicationModel";



export class adminRepository {
    

    async adminCheck(email:string){
        try {
            console.log("login adminrep");
            const adminData = await adminModel.findOne({email:email})
            console.log(adminData)
            if(adminData){
                return adminData
            }
            throw new Error("Doctor Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
    async createSpecialization(name:string,description:string){
        try {
            // Create a new specialization document
            const newSpecialization = new specializationModel({
                name,
                description,
            });
    
            // Save the document to the database
            const savedSpecialization = await newSpecialization.save();
    
            // Optionally, return the saved document or some confirmation
            return savedSpecialization;
        } catch (error: any) {
            console.error("Error creating specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllSpecialization(){
        try {
            
            const specializations = await specializationModel.find()
    
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async updateSpecialization(id:number,name:string,description:string){
        try {
            
            const specializations = await specializationModel.updateOne({_id:id},{name:name,description:description})
            console.log("qq",specializations)
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async changeSpecializationStatus(id: number) {
        try {
            const specialization = await specializationModel.findOne({ _id: id });
            if (!specialization) {
                throw new Error("Specialization not found");
            }
    
            specialization.isListed = !specialization.isListed;
    
            const updatedSpecialization = await specialization.save();
            console.log("Updated Specialization:", updatedSpecialization);
    
            return updatedSpecialization;
        } catch (error: any) {
            console.error("Error updating specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllApplication(){
        try {
            
            const applications = await doctorApplicationModel.find()
    
           
    
            
            return applications
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getApplication(applicationId:string){
        try {
            
            const application = await doctorApplicationModel.findById(applicationId)
    
           console.log("pppp",application)
    
            
            return application
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    
   
}
