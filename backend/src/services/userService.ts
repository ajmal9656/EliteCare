
import { userRepository } from "../repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { FileData,  Slot,  userImage, userType } from "../interface/userInterface/interface";
import sendMail from "../config/emailConfig";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { S3Service} from '../config/s3client';

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
            console.log("hh",userData)
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
                console.log("hh",userData)
                if(userData.image.url!==''){
                    console.log("jbcksc")
                    
                    const folderPath = this.getFolderPathByFileType(userData.image.type);
                      const signedUrl = await this.S3Services.getFile(userData.image.url, folderPath);
                      console.log("f",folderPath);
                      console.log("s",signedUrl);
                      
    
                      userData.image.url = signedUrl
    
                }
                console.log("hhh",userData)
                
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
                console.log("userr",userInfo)
                
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
    async getDoctorsWithSpecialization(specializationId: string) {
        try {
          console.log("Entering getSpecialization method in adminService");
      
          const response = await this.userRepository.getAllDoctorsWithSpecialization(specializationId);
      
          // Check if the response is valid and it's an array
          if (response && Array.isArray(response)) {
            console.log("Specialization successfully fetched:", response);
      
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
      

     private getFolderPathByFileType(fileType: string): string {
        console.log(fileType);
        
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
            // Update the user profile in the repository
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
    
            // Return the updated user profile
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
            console.log(file)

if (file) {
    const profileUrl = await this.S3Services.uploadFile('eliteCare/userProfileImages/', file);
    userProfileImage.profileUrl.url = profileUrl;
    userProfileImage.profileUrl.type = "user profile image";
}
console.log("",userProfileImage)


            

            


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

                  
                  console.log("res",response)

                  return {userInfo};
                
    
                
                
                
                
                
            } 
        } catch (error: any) {
            console.log("service error")
            throw new Error(error.message);
        }
    }
    async checkSlotLocked(doctorId: string, slotId: Slot,date:string,userId:string): Promise< boolean > {
        try {
          // Call userRepository to check the availability of the slot
          const availability = await this.userRepository.checkSlotAvailability(doctorId, slotId,date,userId);
      
          return availability;
      
        } catch (error: any) {
          console.error("Error in checkSlotLocked service:", error.message);
          throw new Error(error.message);
        }
      }
      
    
    
    


    

}