import { doctorRepository } from '../repository/doctorRepository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import sendMail from "../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { doctorType ,DoctorData,DoctorFiles,docDetails} from '../interface/doctorInterface/doctorInterface';
import { S3Service } from '../config/s3client';




dotenv.config()


export class doctorService{
    private doctorRepository: doctorRepository;
    private OTP: string | null = null;
   private expiryOTP_time: Date | null = null;
   private doctorData: doctorType | null = null;
   private S3Service: S3Service;


    constructor(doctorRepository: doctorRepository,S3ServiceInstance: S3Service) {
        this.doctorRepository = doctorRepository;
        this.S3Service = S3ServiceInstance;
     };
   

     async signup(doctorData:{
        name: string,
        email: string,
        phone: string,
        password: string,
        confirmPassword: string,
    
    }){
        try{
            const response = await this.doctorRepository.existDoctor(doctorData.email,doctorData.phone)
            if(response.existEmail){
                throw new Error("Email already in use");

            }
            if(response.existPhone){
                throw new Error("Phone already in use");

            }

    let saltRounds:number =10;

    const hashedPassword = await bcrypt.hash(doctorData.password, saltRounds);

    const doctorId = uuidv4();
    this.doctorData = {
        doctorId: doctorId,
        name: doctorData.name,
        email: doctorData.email,
        phone: doctorData.phone,
        password: hashedPassword,
        createdAt: new Date(),
        kycStatus:"pending"
      };
    const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOTP:string = await bcrypt.hash(Generated_OTP, saltRounds);
    console.log(hashedOTP)

    this.OTP = hashedOTP;

    const sendMailStatus:boolean =await sendMail(doctorData.email,Generated_OTP);

    if(!sendMailStatus){
        throw new Error("Otp not send")

    }
     const Generated_time = new Date();

     this.expiryOTP_time = new Date(Generated_time.getTime()+60*1000);

     const token = jwt.sign({
        doctorData:this.doctorData,
        OTP:this.OTP,
        expirationTime:this.expiryOTP_time
     },process.env.JWT_SECRET as string,{
        expiresIn:"1min"

     })
     console.log("done",token )

     return {token};

    







        }catch(error:any){
            throw error

        }

         


    }

    async otpCheck(otp: string, token: string) {
        try {
            console.log("hhhh")
           
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            console.log("dec",decoded)

            
            const tokenOTP = decoded.OTP;
            const expirationTime = new Date(decoded.expirationTime);
            const doctorData = decoded.doctorData
            console.log(tokenOTP,expirationTime)
            

            if(new Date() < expirationTime){
                const result = await bcrypt.compare(otp, tokenOTP);
                if(result){
                    await this.doctorRepository.createDoctor(doctorData)
                    console.log("true")

                    return { valid: true };

                }else{
                    console.log("error")
                throw new Error("Invalid OTP");

                }
            }else{
                console.log("skjgvjsk")
                throw new Error("OTP has expired");

            }

            
          
            

            
            

        } catch (error: any) {
            console.log("errrrrrr",error);
            
            if (error instanceof jwt.TokenExpiredError) {
                console.log(error.message);
                
                throw new Error("Token has expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error("Invalid token");
            }
            throw error;
        }
    }

    async resendOtpCheck(doctorToken: string) {
        try {
            console.log("resendService")
           
            const decoded: any = jwt.decode(doctorToken);
            console.log("decoded",decoded)

            
            
            const email = decoded.doctorData.email
            console.log("resend email",email);
            const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
            let saltRounds:number =10;
            const hashedOTP:string = await bcrypt.hash(Generated_OTP, saltRounds);
            console.log(hashedOTP)

           this.OTP = hashedOTP;

    

    const sendMailStatus:boolean =await sendMail(email,Generated_OTP);

    if(!sendMailStatus){
        throw new Error("Otp not send")

    }
     const Generated_time = new Date();

     this.expiryOTP_time = new Date(Generated_time.getTime()+60*1000);

     const token = jwt.sign({
        doctorData:this.doctorData,
        OTP:this.OTP,
        expirationTime:this.expiryOTP_time
     },process.env.JWT_SECRET as string,{
        expiresIn:"1min"

     })

     return {token};
            
            

            

            
          
            

            
            

        } catch (error: any) {
            
            
            
            throw error;
        }
    }
    
    async verifyDoctor(email: string, password: string) {
        try {
            console.log("login doctorService");
            const doctorData = await this.doctorRepository.doctorCheck(email);
            if (doctorData) {
                const result = await bcrypt.compare(password, doctorData.password);
                if (!result) {
                    throw new Error("Password is wrong");
                }
                if (doctorData.isBlocked) {
                    throw new Error("Doctor is Blocked");
                }
    
                const accessToken = jwt.sign({ id: doctorData.doctorId, email: doctorData.email }, process.env.JWT_SECRET as string, {
                    expiresIn: "1hr"
                });
                const refreshToken = jwt.sign({ id: doctorData.doctorId, email: doctorData.email }, process.env.JWT_SECRET as string, {
                    expiresIn: "7d"
                });
                
                const doctorInfo = {
                    name: doctorData.name,
                    email: doctorData.email,
                    doctorId: doctorData.doctorId,
                    phone: doctorData.phone,
                    isBlocked: doctorData.isBlocked,
                    docStatus: doctorData.kycStatus
                    
                };
                
                return {
                    doctorInfo,
                    accessToken,
                    refreshToken
                };
            } else {
                console.log("doctordata not found")
                throw new Error("doctor Doesn't exist");
            }
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }
    async uploadData(data:DoctorData,files:DoctorFiles) {
        try {

            const docDetails: docDetails = {
                profileUrl: '',
                aadhaarFrontImageUrl: '',
                aadhaarBackImageUrl: '',
                certificateUrl: '',
                qualificationUrl: ''
            };

if (files.image) {
    const profileUrl = await this.S3Service.uploadFile('eliteCare/doctorProfileImages/', files.image[0]);
    docDetails.profileUrl = profileUrl;
}
if (files.aadhaarFrontImage) {
    const aadhaarFrontImageUrl = await this.S3Service.uploadFile('eliteCare/doctorDocuments/', files.aadhaarFrontImage[0]);
    docDetails.aadhaarFrontImageUrl = aadhaarFrontImageUrl;
}
if (files.aadhaarBackImage) {
    const aadhaarBackImageUrl = await this.S3Service.uploadFile('eliteCare/doctorDocuments/', files.aadhaarBackImage[0]);
    docDetails.aadhaarBackImageUrl = aadhaarBackImageUrl;
}
if (files.certificateImage) {
    const certificateUrl = await this.S3Service.uploadFile('eliteCare/doctorDocuments/', files.certificateImage[0]);
    docDetails.certificateUrl = certificateUrl;
}
if (files.qualificationImage) {
    const qualificationUrl = await this.S3Service.uploadFile('eliteCare/doctorDocuments/', files.qualificationImage[0]);
    docDetails.qualificationUrl = qualificationUrl;
}

            

            


            const response = await this.doctorRepository.uploadDoctorData(data,docDetails);
            // if (response) {
                
    
                
                
                
                
                
            // } 
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }


}