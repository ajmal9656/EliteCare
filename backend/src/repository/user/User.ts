import userModel from "../../model/userModel";
import {  Doctors,  GetDoctorsResponse, MedicalField, ScheduleSlot, SingleDoctor,  userImage,  UserProfileData, UserProfileDetails } from "../../interface/userInterface/interface";
import {  ObjectId } from "mongoose";
import specializationModel from "../../model/SpecializationModel";
import doctorModel from "../../model/doctorModel";
import mongoose from "mongoose";
import doctorSlotsModel from "../../model/doctorSlotModel";
import { IUserRepository } from "../../interface/user/User.respository.interface";

const ObjectId = mongoose.Types.ObjectId;

export class UserRepository implements IUserRepository {
  
  async getAllSpecialization(): Promise<MedicalField[]> {
    try {
      // Use lean() to return plain JavaScript objects
      const specializations = await specializationModel
        .find({ isListed: true })
        .lean();
  
      // Map the data to match the MedicalField interface
      const result: MedicalField[] = specializations.map(item => ({
        _id: item._id.toString(), // Ensure _id is a string
        createdAt: new Date(item.createdAt), // Ensure createdAt is a Date object
        name: item.name,
        description: item.description,
        isListed: item.isListed,
      }));
  
     
  
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  
  async getAllDoctorsWithSpecialization(
    specializationId: string,
    page: number = 1,
    limit: number = 5,
    search: string = ''
  ): Promise<GetDoctorsResponse> {
    try {
      const skip = (page - 1) * limit;
  
      const searchFilter = search
        ? {
            name: { $regex: search, $options: 'i' },
          }
        : {};
  
      const doctors = await doctorModel
        .find(
          {
            department: new ObjectId(specializationId),
            isBlocked: false,
            ...searchFilter,
          },
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
        .populate('department', 'name').skip(skip) // Skip the appropriate number of documents for pagination
        .limit(limit) // Populating the department name
        .lean();
  
      // Transform data to match the Doctors interface
      const transformedDoctors: Doctors[] = doctors.map((doc:any) => ({
        _id: doc._id as ObjectId, // Explicitly cast _id to ObjectId
        doctorId: doc.doctorId,
        name: doc.name,
        email: doc.email,
        department: {
          _id: doc.department._id , // Ensure department matches the Department interface
          name: doc.department.name,
        },
        fees: doc.fees,
        image: {
          _id: doc.image._id , // Ensure image matches the Image interface
          type: doc.image.type,
          url: doc.image.url,
        },
      }));
  
      const totalDoctors = await doctorModel.countDocuments({
        department: new ObjectId(specializationId),
        isBlocked: false,
        ...searchFilter,
      });
  
      return {
        doctors: transformedDoctors,
        totalDoctors,
      };
    } catch (error: any) {
      console.error('Error in getAllDoctorsWithSpecialization:', error.message);
      throw new Error(
        `Failed to fetch doctors for specialization ${specializationId}: ${error.message}`
      );
    }
  }
  
  async getAllDoctors(): Promise<Doctors[]> {
    try {
      const doctors = await doctorModel
        .find(
          { kycStatus: "approved" },
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
        .populate("department", "name") // Populate department with only the name field
        .limit(9)
        .lean(); // This returns plain JavaScript objects, not Mongoose documents

        const transformedDoctors: Doctors[] = doctors.map((doc:any) => ({
          _id: doc._id as ObjectId, // Explicitly cast _id to ObjectId
          doctorId: doc.doctorId,
          name: doc.name,
          email: doc.email,
          department: {
            _id: doc.department._id , // Ensure department matches the Department interface
            name: doc.department.name,
          },
          fees: doc.fees,
          image: {
            _id: doc.image._id , // Ensure image matches the Image interface
            type: doc.image.type,
            url: doc.image.url,
          },
        }));
  
      
  
      // Cast the result to the Doctor[] type (array of Doctor objects)
      return transformedDoctors;
    } catch (error: any) {
      console.error("Error getting doctors:", error.message);
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }
  }
  async getDoctor(doctorId: string, reviewData: any): Promise<SingleDoctor|null>  {
    try {
      const isReviewDataPresent = reviewData === "true";

      const doctor = await doctorModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(doctorId) },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "docId",
            as: "appointments",
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            doctorId: 1,
            email: 1,
            department: 1,
            fees: 1,
            image: 1,
            appointments: {
              $cond: [
                { $eq: [isReviewDataPresent, true] },
                {
                  $map: {
                    input: {
                      $filter: {
                        input: "$appointments", // Input array to filter
                        as: "appointment", // Variable name for each element
                        cond: {
                          // Condition to filter
                          $gt: [
                            { $ifNull: ["$$appointment.review.rating", 0] },
                            0,
                          ], // Access rating
                        },
                      },
                    },
                    as: "appointment",
                    in: {
                      review: "$$appointment.review",
                      patientName: "$$appointment.patientNAme",
                    },
                  },
                },
                [], // Set to empty array if reviewData is not true
              ],
            },
          },
        },
      ]);

      if (doctor.length === 0) {
        return null;
      }

      

      return doctor[0];
    } catch (error: any) {
      console.error("Error getting doctor:", error.message);
      throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
    }
  }

  async getAllSlots(date: Date, doctorId: string): Promise<ScheduleSlot[]> {
    try {
      const doctorSlots = await doctorSlotsModel.findOne({
        doctorId: doctorId,
        date: {
          $eq: date,
        },
      });
  
      if (!doctorSlots) {
        return [];
      }
  
      const availableSlots = doctorSlots.slots
        .filter((slot) => slot.availability)
        .map((slot) => ({
          start: slot.start,
          end: slot.end,
          availability: slot.availability,
          locked: slot.locked,
          lockedBy: slot.lockedBy?.toString(), // Convert ObjectId to string
          lockExpiration: slot.lockExpiration || null,
          bookedBy: slot.bookedBy?.toString() || null,
          _id: slot._id?.toString(), // Convert ObjectId to string
        }));
  
      
  
      return availableSlots; // Return transformed slots
    } catch (error: any) {
      console.error("Error getting slots:", error.message);
      throw new Error(`Failed to fetch slots: ${error.message}`);
    }
  }

  async getUser(userId: string): Promise<UserProfileDetails> {
    try {
      const user = await userModel
        .findById(userId, {
          image: 1,
        })
        .lean(); // Fetch user data as plain JavaScript object
  
      if (!user) {
        throw new Error("User not found");
      }
  
      // Ensure the returned object matches the UserProfileDetails type
      const userProfile: UserProfileDetails = {
        _id: user._id.toString(), // Convert ObjectId to string if necessary
        image: user.image,
      };
  
      
  
      return userProfile;
    } catch (error: any) {
      console.error("Error getting user:", error.message);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
  
  
  async updateProfile(
    userId: string,
    updateData: { name: string; DOB: Date; address: string }
  ): Promise<UserProfileData> {
    try {
      const updatedUser = await userModel
        .findByIdAndUpdate(
          userId,
          { $set: updateData }, // Update fields
          { new: true, lean: true } // Return the updated document as a plain object
        )
        .select("_id userId name email phone password createdAt DOB address isBlocked image __v"); // Ensure selected fields match UserProfileData
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      
  
      return updatedUser as UserProfileData; // Safely cast to your interface
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
  
  async uploadProfileImage(
    userID: string,
    imageData: userImage
  ): Promise<UserProfileData> {
    try {
      const user = await userModel.findById(userID);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      // Update the image fields
      user.image.url = imageData.profileUrl.url;
      user.image.type = imageData.profileUrl.type;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      // Convert to plain object to ensure compatibility with the UserProfileData interface
      const plainUser = updatedUser.toObject();
  
      
  
      return plainUser as UserProfileData; // Explicitly cast to UserProfileData
    } catch (error: any) {
      console.error("Repository error:", error.message);
      throw new Error(error.message);
    }
  }
  

  
  


  
  

}
