import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendMail = async (email: string, otp: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL as string,
        pass: process.env.PASSWORD as string,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL as string,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        resolve(false);  
      } else {
        console.log("Email sent: " + info.response);
        console.log(otp);
        
        resolve(true); 
      }
    });
  });
};


export default sendMail