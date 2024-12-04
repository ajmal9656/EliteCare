import { Document } from "mongoose";
import {  DoctorResult, doctorType } from "../doctorInterface/doctorInterface";


export interface IAuthRepository {
    existDoctor(email:string,phone:string): Promise<{ existEmail: boolean; existPhone: boolean }>;
    createDoctor(doctorData: doctorType): Promise<Document>;
    doctorCheck(email: string): Promise<DoctorResult>;
  

    

    
    
 };