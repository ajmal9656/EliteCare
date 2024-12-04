
import {
  Doctors,
  FileData, 
  GetDoctorsResponse, 
  MedicalField,
  ScheduleSlot,
  SingleDoctor,
  userImage,
  UserProfileData,
  UserProfileDetails,
 
} from "../../interface/userInterface/interface";
import dotenv from "dotenv";
import { S3Service } from "../../config/s3client";
import moment from "moment";
import { cropAndSave } from "../../helper/sharp";
import sharp from "sharp";
import { IUserService } from "../../interface/user/User.service.interface";
import { IUserRepository } from "../../interface/user/User.respository.interface";

dotenv.config();

const S3Services = new S3Service();
export class UserService implements IUserService {
  private S3Services = new S3Service();
  private userRepository: IUserRepository;
  

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  

  async getSpecialization(): Promise<MedicalField[]> {
    try {
      const response = await this.userRepository.getAllSpecialization();

      if (response) {
        return response;
      } else {
        console.error("Failed to get specialization: Response is invalid");
        throw new Error(
          "Something went wrong while fetching the specialization."
        );
      }
    } catch (error: any) {
      console.error("Error in get Specialization:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }
  async getDoctorsWithSpecialization(
    specializationId: string, 
    page: number = 1, 
    limit: number = 5, 
    search: string = ''
  ) : Promise<GetDoctorsResponse>{
    try {
      // Fetch doctors from the repository with the given parameters
      const { doctors, totalDoctors } = await this.userRepository.getAllDoctorsWithSpecialization(
        specializationId, page, limit, search
      );
  
      // Add signed URLs to doctors' images
      const doctorsWithSignedUrls = await Promise.all(
        doctors.map(async (doctor:any) => {
          if (doctor.image && doctor.image.url && doctor.image.type) {
            const folderPath = this.getFolderPathByFileType(doctor.image.type);
            const signedUrl = await this.S3Services.getFile(doctor.image.url, folderPath);
            return {
              ...doctor,
              signedImageUrl: signedUrl, // Include the signed URL for the image
            };
          }
          return doctor; // Return the doctor as is if no image
        })
      );

      console.log("docccccc",doctors)
  
      return {
        doctors: doctorsWithSignedUrls,
        totalDoctors,
      };
    } catch (error: any) {
      console.error("Error in getDoctorsWithSpecialization:", error.message);
      throw new Error(`Failed to get doctors with specialization: ${error.message}`);
    }
  }
  
  async getDoctors(): Promise<Doctors[]> {
    try {
      const response =
        await this.userRepository.getAllDoctors();

      if (response && Array.isArray(response)) {
        // Iterate through the list of doctors and handle the image for each
        const doctorsWithSignedUrls = await Promise.all(
          response.map(async (doctor) => {
            if (doctor.image && doctor.image.url && doctor.image.type) {
              const folderPath = this.getFolderPathByFileType(
                doctor.image.type
              );
              const signedUrl = await this.S3Services.getFile(
                doctor.image.url,
                folderPath
              );

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
        console.error(
          "Failed to get doc: Response is invalid or not an array"
        );
        throw new Error(
          "Something went wrong while fetching the doc"
        );
      }
    } catch (error: any) {
      console.error("Error in getDoctorsWithSpecialization:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }
  async getDoctorData(doctorId: string, reviewData: any): Promise<SingleDoctor|null|undefined> {
    try {
      const response = await this.userRepository.getDoctor(
        doctorId,
        reviewData
      );

      if (response?.image && response.image.url && response.image.type) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Services.getFile(
          response.image.url,
          folderPath
        );

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
      case "profile image":
        return "eliteCare/doctorProfileImages";
      case "document":
        return "eliteCare/doctorDocuments";
      case "user profile image":
        return "eliteCare/userProfileImages";

      default:
        throw new Error(`Unknown file type: ${fileType}`);
    }
  }

  async getSlots(date: string, doctorId: string): Promise<ScheduleSlot[]> {
    try {
      // Validate the inputs
      if (!date || !doctorId) {
        throw new Error("Date and doctorId must be provided.");
      }

      const parsedDate = new Date(date);

      const availableSlots = await this.userRepository.getAllSlots(
        parsedDate,
        doctorId
      );

      return availableSlots;
    } catch (error: any) {
      console.error("Error in getSlots:", error.message);
      throw new Error(`Failed to get slots: ${error.message}`);
    }
  }

  async getUserData(userId: string): Promise<UserProfileDetails|undefined> {
    try {
      const response = await this.userRepository.getUser(
        userId
      );

      if (response?.image && response.image.url && response.image.type) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Services.getFile(
          response.image.url,
          folderPath
        );

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

  async updateProfile(
    _id: string,
    updateData: { name: string; DOB: Date; address: string }
  ): Promise<{userInfo:UserProfileData}> {
    try {
      const updatedUser = await this.userRepository.updateProfile(
        _id,
        updateData
      );

      if (updatedUser.image != null) {
        const folderPath = this.getFolderPathByFileType(updatedUser.image.type);
        const signedUrl = await this.S3Services.getFile(
          updatedUser.image.url,
          folderPath
        );

        updatedUser.image.url = signedUrl;
      }

      const userInfo = {
        name: updatedUser.name,
        email: updatedUser.email,
        userId: updatedUser.userId,
        phone: updatedUser.phone,
        isBlocked: updatedUser.isBlocked,
        DOB: updatedUser.DOB,
        address: updatedUser.address,
        image: updatedUser.image,
        _id: updatedUser._id,
      };

      return { userInfo };
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
  async updateImage(userID: string, file: FileData): Promise<{userInfo:UserProfileData}|undefined> {
    try {
      const userProfileImage: userImage = {
        profileUrl: {
          type: "",
          url: "",
        },
      };

      if (file) {
        

        // Load the image buffer into sharp and get metadata
        const image = await sharp(file.buffer);
        const metadata = await image.metadata();

        const width = metadata.width;
        const height = metadata.height;

        // Check if width and height are defined
        if (width === undefined || height === undefined) {
          throw new Error("Image metadata could not be retrieved.");
        }

        // Calculate the size and position for cropping
        const squareSize = Math.min(width, height); // Ensuring the crop is square
        const x = (width - squareSize) / 2; // X position for cropping (centered)
        const y = (height - squareSize) / 2; // Y position for cropping (centered)

        // Crop the image into a square
        const croppedBuffer = await cropAndSave(
          x,
          y,
          squareSize,
          squareSize,
          file.buffer
        );

        file.buffer = croppedBuffer;

        // Upload the cropped image to S3
        const profileUrl = await this.S3Services.uploadFile(
          "eliteCare/userProfileImages/",
          file
        );

        // Set the profile image details
        userProfileImage.profileUrl.url = profileUrl;
        userProfileImage.profileUrl.type = "user profile image";
      }

      // Update the user profile with the new image data
      const response = await this.userRepository.uploadProfileImage(
        userID,
        userProfileImage
      );

      if (response) {
        // Get the folder path for the file based on its type
        const folderPath = this.getFolderPathByFileType(response.image.type);

        // Retrieve a signed URL for the image
        const signedUrl = await this.S3Services.getFile(
          response.image.url,
          folderPath
        );
        response.image.url = signedUrl;

        // Constructing the user info response with the updated image URL
        const userInfo = {
          name: response.name,
          email: response.email,
          userId: response.userId,
          phone: response.phone,
          isBlocked: response.isBlocked,
          DOB: response.DOB,
          address: response.address,
          image: response.image,
          _id: response._id,
        };

        return { userInfo }; // Return the updated user info
      }
    } catch (error: any) {
      // Error handling
      throw new Error(`Error updating profile image: ${error.message}`);
    }
  }
  

  


  getTime(slot: any) {
    return moment(slot).tz("UTC").format("h:mm A");
  }

  
}
