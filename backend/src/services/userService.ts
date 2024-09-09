
import { userRepository } from "../repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { userType } from "../interface/interface";
import sendMail from "../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config()


export class userService{
   private userRepository: userRepository;
   private OTP: string | null = null;
   private expiryOTP_time: Date | null = null;
   private userData: userType | null = null;

   constructor(userRepository: userRepository) {
      this.userRepository = userRepository;
   };

    async signup(userData:{
        name: string,
        email: string,
        phone: string,
        password: string,
        confirmpassword: string,
    
    }){
        try{
            const response = await this.userRepository.existUser(userData.email,userData.phone)
            if(response.existEmail){
                throw new Error("Email already in use");

            }
            if(response.existPhone){
                throw new Error("Phone already in use");

            }

    let saltRounds:number =10;

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const userId = uuidv4();
    this.userData = {
        userId: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        createdAt: new Date(),
      };
    const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOTP:string = await bcrypt.hash(Generated_OTP, saltRounds);

    this.OTP = hashedOTP;

    const sendMailStatus:boolean =await sendMail(userData.email,Generated_OTP);

    if(!sendMailStatus){
        throw new Error("Otp not send")

    }
     const Generated_time = new Date();

     this.expiryOTP_time = new Date(Generated_time.getTime()+60*1000);

     const token = jwt.sign({
        userData:this.userData,
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
            const userData = decoded.userData
            console.log(tokenOTP,expirationTime)
            

            if(new Date() < expirationTime){
                const result = await bcrypt.compare(otp, tokenOTP);
                if(result){
                    await this.userRepository.createUser(userData)
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
    async verifyUser(email: string, password: string) {
        try {
            console.log("login userService");
            const userData = await this.userRepository.userCheck(email);
            if (userData) {
                const result = await bcrypt.compare(password, userData.password);
                if (!result) {
                    throw new Error("Password is wrong");
                }
                if (userData.isBlocked) {
                    throw new Error("User is Blocked");
                }
    
                const accessToken = jwt.sign({ id: userData.userId, email: userData.email }, process.env.JWT_SECRET as string, {
                    expiresIn: "1hr"
                });
                const refreshToken = jwt.sign({ id: userData.userId, email: userData.email }, process.env.JWT_SECRET as string, {
                    expiresIn: "7d"
                });
                
                const userInfo = {
                    name: userData.name,
                    email: userData.email,
                    userId: userData.userId,
                    phone: userData.phone,
                    isBlocked: userData.isBlocked,
                };
                
                return {
                    userInfo,
                    accessToken,
                    refreshToken
                };
            } else {
                console.log("userdata not found")
                throw new Error("User Doesn't exist");
            }
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }

    async resendOtpCheck(userToken: string) {
        try {
            console.log("resendService")
           
            const decoded: any = jwt.decode(userToken);
            console.log("decoded",decoded)

            
            
            const email = decoded.userData.email
            console.log("resend email",email);
            const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
            let saltRounds:number =10;
            const hashedOTP:string = await bcrypt.hash(Generated_OTP, saltRounds);

           this.OTP = hashedOTP;

    

    const sendMailStatus:boolean =await sendMail(email,Generated_OTP);

    if(!sendMailStatus){
        throw new Error("Otp not send")

    }
     const Generated_time = new Date();

     this.expiryOTP_time = new Date(Generated_time.getTime()+60*1000);

     const token = jwt.sign({
        userData:this.userData,
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

    async getSpecialization() {
        try {
            console.log("Entering getSpecialization method in adminService");
    
            
            const response = await this.userRepository.getAllSpecialization();
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully fetched:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to get specialization: Response is invalid");
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    async getDoctorsWithSpecialization(specializationId:string) {
        try {
            console.log("Entering getSpecialization method in adminService");
    
            
            const response = await this.userRepository.getAllDoctorsWithSpecialization(specializationId);
    
            // Check if the response is valid
            if (response) {
                console.log("Specialization successfully fetched:", response);
                return response;
            } else {
                // Handle the case where the response is not as expected
                console.error("Failed to get specialization: Response is invalid");
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message
            console.error("Error in addSpecialization:", error.message);
            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }
    

}