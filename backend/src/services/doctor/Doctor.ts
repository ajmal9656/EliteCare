import dotenv from "dotenv";
import {
  DoctorData,
  DoctorFiles,
  docDetails,
  doctorImage,
  FileData,
  GetTransactionData,
  IDoctor,
  IDoctorInformation,
  IDashboardStats,
  IDoctorImageInfo,
  
} from "../../interface/doctorInterface/doctorInterface";
import { S3Service } from "../../config/s3client";
import { cropAndSave } from "../../helper/sharp";
import sharp from "sharp";
import { IWallet } from "../../model/walletModel";
import { IDoctorRepository } from "../../interface/doctor/Doctor.repository.interface";
import { IDoctorService } from "../../interface/doctor/Doctor.service.interface";


dotenv.config();

export class DoctorService implements IDoctorService {
  private DoctorRepository: IDoctorRepository;
 
  private S3Service: S3Service;

  constructor(
    DoctorRepository:IDoctorRepository,
    S3ServiceInstance: S3Service
  ) {
    this.DoctorRepository = DoctorRepository;
    this.S3Service = S3ServiceInstance;
  }

  
  async uploadData(data: DoctorData, files: DoctorFiles): Promise<boolean|undefined> {
    try {
      console.log("entered upload service");
      const docDetails: docDetails = {
        profileUrl: {
          type: "",
          url: "",
        },
        aadhaarFrontImageUrl: {
          type: "",
          url: "",
        },
        aadhaarBackImageUrl: {
          type: "",
          url: "",
        },
        certificateUrl: {
          type: "",
          url: "",
        },
        qualificationUrl: {
          type: "",
          url: "",
        },
      };
      if (files.image) {
        
        
        

        // Load the image buffer into sharp and get metadata
        const image = await sharp(files.image[0].buffer);
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
          files.image[0].buffer
        );

        files.image[0].buffer = croppedBuffer;
        const profileUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorProfileImages/",
          files.image[0]
        );
        docDetails.profileUrl.url = profileUrl;
        docDetails.profileUrl.type = "profile image";
      }

      // if (files.image) {
      //   const profileUrl = await this.S3Service.uploadFile(
      //     "eliteCare/doctorProfileImages/",
      //     files.image[0]
      //   );
      //   docDetails.profileUrl.url = profileUrl;
      //   docDetails.profileUrl.type = "profile image";
      // }
      if (files.aadhaarFrontImage) {
        const aadhaarFrontImageUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.aadhaarFrontImage[0]
        );
        docDetails.aadhaarFrontImageUrl.url = aadhaarFrontImageUrl;
        docDetails.aadhaarFrontImageUrl.type = "document";
      }
      if (files.aadhaarBackImage) {
        const aadhaarBackImageUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.aadhaarBackImage[0]
        );
        docDetails.aadhaarBackImageUrl.url = aadhaarBackImageUrl;
        docDetails.aadhaarBackImageUrl.type = "document";
      }
      if (files.certificateImage) {
        const certificateUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.certificateImage[0]
        );
        docDetails.certificateUrl.url = certificateUrl;
        docDetails.certificateUrl.type = "document";
      }
      if (files.qualificationImage) {
        const qualificationUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorDocuments/",
          files.qualificationImage[0]
        );
        docDetails.qualificationUrl.url = qualificationUrl;
        docDetails.qualificationUrl.type = "document";
      }

      const response = await this.DoctorRepository.uploadDoctorData(
        data,
        docDetails
      );
      console.log("upload data service",response);
      if (response) {
        return response;
      }
    } catch (error: any) {
      console.log("service error");
      throw new Error(error.message);
    }
  }
  

  
  


  

  

  async getWallet(doctorId: string, status: string, page: number, limit: number): Promise<GetTransactionData> {
    try {
        const response = await this.DoctorRepository.getWalletDetails(
            doctorId,
            status,
            page,
            limit
        );
        return response;
    } catch (error: any) {
        console.error("Error in getWallet:", error.stack || error.message);
        throw new Error(`Failed to get wallet details: ${error.message}`);
    }
}

  async withdraw(doctorId: string, withdrawalAmount: number): Promise<IWallet> {
    try {
      const response = await this.DoctorRepository.withdrawMoney(
        doctorId,
        withdrawalAmount
      );

      return response;
    } catch (error: any) {
      console.error("Error in withdraw:", error.stack || error.message);
      throw new Error(`Failed to withdraw: ${error.message}`);
    }
  }

  async getDoctorData(doctorId: string, reviewData: any): Promise<IDoctor|undefined> {
    try {
      const response = await this.DoctorRepository.getDoctor(
        doctorId,
        reviewData
      );

      if (response?.image && response.image.url && response.image.type) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Service.getFile(
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

  async updateProfile(
    _id: string,
    updateData: { fees: number; DOB: Date; phone: string }
  ): Promise<{doctorInfo:IDoctorInformation}> {
    try {
      const updatedDoctor = await this.DoctorRepository.updateProfile(
        _id,
        updateData
      );

      if (updatedDoctor.image != null) {
        const folderPath = this.getFolderPathByFileType(
          updatedDoctor.image.type
        );
        const signedUrl = await this.S3Service.getFile(
          updatedDoctor.image.url,
          folderPath
        );

        updatedDoctor.image.url = signedUrl;
      }

      const doctorInfo = {
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        doctorId: updatedDoctor._id,
        phone: updatedDoctor.phone,
        isBlocked: updatedDoctor.isBlocked,
        DOB: updatedDoctor.DOB,
        fees: updatedDoctor.fees,
        image: updatedDoctor.image,
      };

      return { doctorInfo };
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getDashboardData(doctorId: string): Promise<IDashboardStats> {
    try {
      

      const response = await this.DoctorRepository.getAllStatistics(
        doctorId as string
      );

      if (response) {
        
        return response;
      } else {
        console.error("Failed to retrieve dashboard data: Response is invalid");
        throw new Error(
          "Something went wrong while retrieving dashboard data."
        );
      }
    } catch (error: any) {
      console.error("Error in getDashboardData:", error.message);
      throw new Error(`Failed to retrieve dashboard data: ${error.message}`);
    }
  }

  async updateImage(userID: string, file: FileData): Promise<{doctorInfo:IDoctorImageInfo}> {
    try {
      const doctorProfileImage: doctorImage = {
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
        const profileUrl = await this.S3Service.uploadFile(
          "eliteCare/doctorProfileImages/",
          file
        );
        doctorProfileImage.profileUrl.url = profileUrl;
        doctorProfileImage.profileUrl.type = "profile image";
      }

      const response = await this.DoctorRepository.uploadProfileImage(
        userID,
        doctorProfileImage
      );
      if (response) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Service.getFile(
          response.image.url,
          folderPath
        );

        const doctorInfo = {
          name: response.name,
          email: response.email,
          doctorId: response._id,
          phone: response.phone,
          isBlocked: response.isBlocked,
          DOB: response.DOB,
          fees: response.fees,
          image: signedUrl,
        };

       
        

        return { doctorInfo };
      }else{
        throw new Error("Image metadata could not be retrieved.");

      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  

  async doctorDetails(email: string): Promise<any> {
    try {
      const response = await this.DoctorRepository.doctorData(
        email
      );

      return response
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }
}
