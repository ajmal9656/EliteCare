import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp,resendOtp } from '../../Redux/Action/doctorActions'; 
import { toast } from 'sonner';

function OTPForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem('otp-timer');
    return savedTimer ? parseInt(savedTimer) : 60;
  });
  const [buttonText, setButtonText] = useState("Submit");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem('otp-timer', newTimer.toString());
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setButtonText("Resend OTP");
      localStorage.removeItem('otp-timer');
    }
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (buttonText === "Resend OTP") {
      try {
        const resendOtpStatus = await dispatch(resendOtp());
        if (resendOtpStatus.status) {
          toast.success("OTP Resent");
          setOtp(Array(4).fill(""));
          setTimer(60);
          setButtonText("Submit");
        }
      } catch (error: any) {
        toast.error("Failed to resend OTP");
      }
    } else {
      try {
        const otpVerification = await dispatch(verifyOtp(otpValue));
        if (otpVerification.status) {
          toast.success("Success");
          navigate("/doctor/login");
        } else {
          toast.error(otpVerification.message || "Error occurred");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full mx-4 sm:mx-auto shadow px-6 py-7 rounded overflow-hidden bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">Enter OTP</h2>
        <p className="text-gray-600 mb-6 text-sm text-center">Enter Your OTP Here</p>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <p className="text-red-500"></p>
          <div className="flex space-x-2 mb-4 justify-center">
            {/* Input Fields for OTP */}
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-300 px-4 py-3 text-gray-600 text-lg rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400 text-center"
                placeholder="0"
              />
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center">
            <button 
              type="submit" 
              className="w-48 py-3 text-center text-white bg-teal-500 border border-teal-500 rounded hover:bg-transparent hover:text-teal-500 transition uppercase font-medium"
            >
              {buttonText}
            </button>
            <div className="text-gray-600 mt-4">
              {timer > 0 ? (
                <>Resend OTP in <span className="text-teal-500">{timer}s</span></>
              ) : (
                "OTP expired"
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OTPForm;
