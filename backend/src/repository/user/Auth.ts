import userModel from "../../model/userModel";
import { UserProfile, userType } from "../../interface/userInterface/interface";
import { Document, ObjectId } from "mongoose";
import mongoose from "mongoose";
import { IAuthRepository } from "../../interface/user/Auth.repository.interface";


const ObjectId = mongoose.Types.ObjectId;

export class AuthRepository implements IAuthRepository {
  async existUser(
    email: string,
    phone: string
  ): Promise<{ existEmail: boolean; existPhone: boolean }> {
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
      console.error("Error checking if user exists:", error);
      throw new Error("Error checking if user exists");
    }
  }
  async createUser(userData: userType): Promise<Document> {
    try {
        console.log("user data",userData);
        
      const newUser = new userModel(userData);
      return await newUser.save();
    } catch (error: any) {
      console.log("Error in creating new User", error);
      throw new Error(`Error creating user : ${error.message}`);
    }
  }
  async userCheck(email: string): Promise<UserProfile | null> {
    try {
      const userData = await userModel.findOne(
        { email: email }
      ).lean();
      
      if (userData) {
        
        return {
          _id: userData._id as ObjectId,
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          createdAt: userData.createdAt,
          DOB: userData.DOB,
          address: userData.address,
          isBlocked: userData.isBlocked,
          image: userData.image,
          password:userData.password
         
        }; ;
      }
      throw new Error("User Doesn't exist");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  

 
  
 
  

  
  

}
