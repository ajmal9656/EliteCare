import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/HttpStatusCode";
import { IAuthService } from "../../interface/admin/Auth.service.interface";


export class AuthController {
    private AuthService: IAuthService;



    constructor(AuthServiceInstance: IAuthService) {
        this.AuthService = AuthServiceInstance;
      }



      
      async loginAdmin(req: Request, res: Response): Promise<void> {
        try {
          console.log("login adminController");
              
    
          const {email,password} = req.body;
    
          const loginResponse = await this.AuthService.verifyAdmin(email,password)
          console.log("controller res",loginResponse)
          
          const response = {
            
            adminInfo:loginResponse.adminInfo
          }
          console.log(res);
          
          res.cookie('RefreshToken', loginResponse.refreshToken, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict',  // Protects against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 21 days
          });
          res.cookie('AccessToken', loginResponse.accessToken, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict',  // Protects against CSRF attacks
            maxAge: 1 * 24 * 60 * 60 * 1000,  // 7 days
          });
          console.log("logindata",response)
          res.status(HTTP_statusCode.OK).json({ message: "Login successful", response});
            
        } catch (error: any) {
          console.log("controller error")
          if(error.message==="Admin Doesn't exist"){
            res.status(HTTP_statusCode.BadRequest).json({ message: "Admin Doesn't exist" });
    
        }
          if(error.message==="Password is wrong"){
            res.status(HTTP_statusCode.BadRequest).json({ message: "Password is wrong" });
    
        }
          if(error.message==="Admin is Blocked"){
            res.status(HTTP_statusCode.BadRequest).json({ message: "Admin is Blocked" });
    
        }
           
        }
      }
      async logoutAdmin(req: Request, res: Response): Promise<void> {
        try {
          // Clear the access token and refresh token cookies
          res.cookie('AccessToken', '', { httpOnly: true, expires: new Date(0) });
          res.cookie('RefreshToken', '', { httpOnly: true, expires: new Date(0) });
      
          // Send success response
          res.status(HTTP_statusCode.OK).json({ message: "Logout successful" });
        } catch (error: any) {
          console.error('Logout error:', error);
          res.status(HTTP_statusCode.InternalServerError).json({ message: "Logout failed" });
        }
      }
    
 

  

  
    

      
}
