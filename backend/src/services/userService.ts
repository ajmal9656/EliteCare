
import { userRepository } from "../repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { FileData,  Slot,  userImage, userType } from "../interface/userInterface/interface";
import sendMail from "../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { S3Service} from '../config/s3client';
import { Appointment } from "../interface/userInterface/interface";
import makeThePayment, { refund } from "../config/stripeConfig";
import { log } from "console";
import moment from "moment";

dotenv.config()

const S3Services = new S3Service()
export class userService{
   private S3Services = new S3Service()
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
    

     return {token};

    







        }catch(error:any){
            throw error

        }

         


    }

    async otpCheck(otp: string, token: string) {
        try {
            
           
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            

            
            const tokenOTP = decoded.OTP;
            const expirationTime = new Date(decoded.expirationTime);
            const userData = decoded.userData
            
            

            if(new Date() < expirationTime){
                const result = await bcrypt.compare(otp, tokenOTP);
                if(result){
                    await this.userRepository.createUser(userData)
                    

                    return { valid: true };

                }else{
                    
                throw new Error("Invalid OTP");

                }
            }else{
               
                throw new Error("OTP has expired");

            }

            
          
            

            
            

        } catch (error: any) {
            
            
            if (error instanceof jwt.TokenExpiredError) {
                
                
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
                
                if(userData.image.url!==''){
                  
                    
                    const folderPath = this.getFolderPathByFileType(userData.image.type);
                      const signedUrl = await this.S3Services.getFile(userData.image.url, folderPath);
                     
                      
    
                      userData.image.url = signedUrl
    
                }
                
                
                const userInfo = {
                    name: userData.name,
                    email: userData.email,
                    userId: userData.userId,
                    phone: userData.phone,
                    isBlocked: userData.isBlocked,
                    DOB:userData.DOB,
                    address:userData.address,
                    image:userData.image,
                    _id:userData._id
                };
                
                
                return {
                    userInfo,
                    accessToken,
                    refreshToken
                };
            } else {
                
                throw new Error("User Doesn't exist");
            }
        } catch (error: any) {
            
            throw new Error(error.message);
        }
    }

    async resendOtpCheck(userToken: string) {
        try {
            
           
            const decoded: any = jwt.decode(userToken);
            

            
            
            const email = decoded.userData.email
          
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
            
    
            
            const response = await this.userRepository.getAllSpecialization();
    
           
            if (response) {
                
                return response;
            } else {
               
                console.error("Failed to get specialization: Response is invalid");
                throw new Error("Something went wrong while fetching the specialization.");
            }
        } catch (error: any) {
            
            console.error("Error in get Specialization:", error.message);
            throw new Error(`Failed to get specialization: ${error.message}`);
        }
    }
    async getDoctorsWithSpecialization(specializationId: string) {
        try {
          
      
          const response = await this.userRepository.getAllDoctorsWithSpecialization(specializationId);
      
        
          if (response && Array.isArray(response)) {
            
      
            // Iterate through the list of doctors and handle the image for each
            const doctorsWithSignedUrls = await Promise.all(
              response.map(async (doctor) => {
                if (doctor.image && doctor.image.url && doctor.image.type) {
                  const folderPath = this.getFolderPathByFileType(doctor.image.type);
                  const signedUrl = await this.S3Services.getFile(doctor.image.url, folderPath);
      
                  // Append signed URL to the doctor object
                  return {
                    ...doctor,
                    signedImageUrl: signedUrl, // Include signed URL for the image
                  };
                }
                return doctor;
              })
            );
      
            return doctorsWithSignedUrls;
          } else {
            console.error("Failed to get specialization: Response is invalid or not an array");
            throw new Error("Something went wrong while fetching the specialization.");
          }
        } catch (error: any) {
          console.error("Error in getDoctorsWithSpecialization:", error.message);
          throw new Error(`Failed to get specialization: ${error.message}`);
        }
      }
    async getDoctorData(doctorId: string,reviewData:any) {
        try {
          
      
          const response = await this.userRepository.getDoctor(doctorId,reviewData);

          if (response?.image && response.image.url && response.image.type) {
            const folderPath = this.getFolderPathByFileType(response.image.type);
            const signedUrl = await this.S3Services.getFile(response.image.url, folderPath);

           
            return {
              ...response,
              signedImageUrl: signedUrl, 
            };
          }
      
          
        } catch (error: any) {
          console.error("Error in getDoctor:", error.message);
          throw new Error(`Failed to get specialization: ${error.message}`);
        }
      }
      

     private getFolderPathByFileType(fileType: string): string {
        
        
        switch (fileType) {
            case 'profile image':
                return 'eliteCare/doctorProfileImages';
            case 'document':
                return 'eliteCare/doctorDocuments';
            case 'user profile image':
                return 'eliteCare/userProfileImages';
            
            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }

    async getSlots(date: string, doctorId: string) {
        try {
            // Validate the inputs
            if (!date || !doctorId) {
                throw new Error("Date and doctorId must be provided.");
            }
    
            const parsedDate = new Date(date);
    
            // Get the available slots from the repository
            const availableSlots = await this.userRepository.getAllSlots(parsedDate, doctorId);
    
            // Return the available slots
            return availableSlots;
        } catch (error: any) {
            console.error("Error in getSlots:", error.message);
            throw new Error(`Failed to get slots: ${error.message}`);
        }
    }
    
    async updateProfile(_id: string, updateData: { name: string; DOB: Date; address: string }): Promise<any> {
        try {
            
            const updatedUser = await this.userRepository.updateProfile(_id, updateData);

            if(updatedUser.image!=null){
                const folderPath = this.getFolderPathByFileType(updatedUser.image.type);
                  const signedUrl = await this.S3Services.getFile(updatedUser.image.url, folderPath);

                  updatedUser.image.url = signedUrl

            }

            const userInfo = {
                name: updatedUser.name,
                email: updatedUser.email,
                userId: updatedUser.userId,
                phone: updatedUser.phone,
                isBlocked: updatedUser.isBlocked,
                DOB:updatedUser.DOB,
                address:updatedUser.address,
                image:updatedUser.image,
                _id:updatedUser._id
            };
    
            
            return {userInfo};
        } catch (error: any) {
            console.error("Error in updateProfile:", error.message);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }
    async updateImage(userID:string,file:FileData) {
        try {

            const userProfileImage: userImage = {
                profileUrl: {
                    type:'',
                    url:''
                }
            };
            

if (file) {
    const profileUrl = await this.S3Services.uploadFile('eliteCare/userProfileImages/', file);
    userProfileImage.profileUrl.url = profileUrl;
    userProfileImage.profileUrl.type = "user profile image";
}



            

            


            const response = await this.userRepository.uploadProfileImage(userID,userProfileImage);
            if (response) {
                

                const folderPath = this.getFolderPathByFileType(response.image.type);
                  const signedUrl = await this.S3Services.getFile(response.image.url, folderPath);
                  response.image.url = signedUrl
                  const userInfo = {
                    name: response.name,
                    email: response.email,
                    userId: response.userId,
                    phone: response.phone,
                    isBlocked: response.isBlocked,
                    DOB:response.DOB,
                    address:response.address,
                    image:response.image,
                    _id:response._id
                };

                  
                 

                  return {userInfo};
                
    
                
                
                
                
                
            } 
    } catch (error: any)  {  
            throw new Error(error.message);
        }
    }
    async checkSlotLocked(doctorId: string, slotId: Slot,date:string,userId:string): Promise< boolean > {
        try {
          
          const availability = await this.userRepository.checkSlotAvailability(doctorId, slotId,date,userId);
      
          return availability;
      
        } catch (error: any) {
          console.error("Error in checkSlotLocked service:", error.message);
          throw new Error(error.message);
        }
      }
      async createSession(appointmentData: Appointment): Promise<any> {
        try {

            const data = {
                
                doctor: appointmentData.doctor,
                slot: appointmentData.slot,
                date: appointmentData.date,
                image:appointmentData.doctor.signedImageUrl
            };
            const patientData = {
                patientName: appointmentData.patientName,
                age: parseInt(appointmentData.age),
                description: appointmentData.description,
                doctor: appointmentData.doctor,
                slot: appointmentData.slot,
                date: appointmentData.date,
                image:appointmentData.doctor.signedImageUrl,
                userId:appointmentData.userId

            }
            const appointment =await this.userRepository.createAppointment(patientData);
            

            if(appointment){

                const session = await makeThePayment(data,appointment._id)
            if(session){
                
                const updateAppointment =await this.userRepository.updateAppointment(session.id,appointment._id)
              
            return session;
                
            }

            }


            

            
            
            

        } catch (error: any) {
            console.error("Error in createSession servicessss:", error.message);
            throw new Error(error.message);
        }
    }
      async confirmAppointment(appointmentId: string): Promise<any> {
        try {

            
            const confirmAppointment =await this.userRepository.confirmAppointmentPayment(appointmentId);
            

            return confirmAppointment


            

           
            
            

        } catch (error: any) {
            console.error("Error in createSession service:", error.message);
            throw new Error(error.message);
        }
    }

    async getAppointments(userId: string, status: string) {
        try {
            // Fetch appointments for the given userId from the userRepository
            const response = await this.userRepository.getAllAppointments(userId, status);
    
            if (response) {
                console.log("appointments", response);
    
                // Map over the appointments to transform start and end times
                const updatedAppointments = response.map((appointment: any) => ({
                    ...appointment,
                    start: this.getTime(appointment.start),
                    end: this.getTime(appointment.end)
                }));

                console.log("up",updatedAppointments);
                
    
                return updatedAppointments; // Return the updated appointments
            } else {
                // Log and throw an error if the response is invalid
                console.error("Failed to get appointments: Response is invalid");
                throw new Error("Something went wrong while fetching the appointments.");
            }
        } catch (error: any) {
            // Log the error with a descriptive message and rethrow it
            console.error("Error in getAppointments:", error.message);
            throw new Error(`Failed to get appointments: ${error.message}`);
        }
    }
    
    getTime(slot: any) {
        return moment(slot).tz('UTC').format('h:mm A');
    }
    
    async cancelAppointment(appointmentId: string): Promise<any> {
        try {
          // Call the repository to cancel the appointment using the provided appointmentId
          const response = await this.userRepository.cancelAppointment(appointmentId);
      
          // Check if the repository returned a valid response
          if (response) {
            
      
            // Assuming the response contains a paymentId for the appointment
            const paymentId = response.paymentId; // Adjust this according to your response structure
      
            // Proceed to refund if a valid paymentId is available
            if (paymentId) {
                
                
              // Call the refund function and await the result
              const refundResponse = await refund(paymentId); // Ensure the refund method is available in the class
      
              // Return the updated appointment and refund details
              return response;
            } else {
              throw new Error("No payment ID available for refund");
            }}
        } catch (error: any) {
          // Log the error and rethrow it with a more specific message
          console.error("Error in cancelAppointment:", error.message);
          throw new Error(`Failed to cancel appointment: ${error.message}`);
        }
      }
      async addReview(appointmentId: string, rating: number, review: string): Promise<any> {
        try {
          // Call the repository to add the review for the given appointment ID
          const response = await this.userRepository.addReview(appointmentId, rating, review);
      
          // Check if the repository returned a valid response
          if (!response) {
            throw new Error('Appointment not found or review could not be added');
          }
      
          // Return the updated appointment (including the review)
          return response;
        } catch (error: any) {
          // Log the error for debugging purposes
          console.error("Error in addReview:", error.message);
      
          // Throw a more specific error message to the caller
          throw new Error(`Failed to add review: ${error.message}`);
        }
      }

      async getAppointment(appointmentId: string) {
        try {
            // Fetch appointment from the repository
            const response = await this.userRepository.getAppointment(appointmentId);
    
            if (response) {
                console.log("appointments", response);
    
                // Update start and end times using helper function
                const updatedAppointment = {
                    ...response,
                    start: this.getTime(response.start), // Use default value if missing
                    end: this.getTime(response.end)      // Use default value if missing
                };
    
                console.log("updated appointment", updatedAppointment);
                
                return updatedAppointment; // Return the updated appointment
            } else {
                // Log and throw an error if response is invalid
                console.error("Failed to get appointment: Response is invalid");
                throw new Error("Something went wrong while fetching the appointment.");
            }
        } catch (error: any) {
            // Log the error with more details
            console.error("Error in getAppointment:", error.message);
            throw new Error(`Failed to get appointment: ${error.message}`);
        }
    }
    
      
      
      
    
      
    
    
    


    

}