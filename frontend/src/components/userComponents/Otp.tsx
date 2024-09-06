import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp,resendOtp } from '../../Redux/Action/userActions'; // Import resendOtp if needed
import { toast } from 'sonner';
import image from '../../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg';

function OtpPage() {
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
                if(resendOtpStatus.status){
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
                    navigate("/login");
                } else {
                    toast.error(otpVerification.message || "Error occurred");
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="relative bg-center  mt-0 min-h-screen">
        <div className='absolute -z-10 h-full overflow-hidden '>
          <div className='absolute bg-[#833a3a1f] w-full h-full' ></div>
          <img src={image} alt="" className='w-screen object-contain' />
        </div>
        <section className="flex flex-row justify-center items-end py-10  " >
          <div
           className="w-full bg-[#ffffff24] rounded-lg shadow  md:mt-32 sm:max-w-md xl:p-0  ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Enter OTP
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
  <div className="flex justify-center space-x-2">
    {otp.map((digit, index) => (
      <input
        key={index}
        type="text"
        id={`otp-${index}`}
        name={`otp-${index}`}
        maxLength={1}
        value={digit}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        className="h-[60px] w-[60px] text-2xl text-center bg-transparent border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    ))}
  </div>
  <div className="flex justify-center">
    <button
      type="submit"
      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-[160px]"
    >
      {buttonText}
    </button>
  </div>
  <div className="text-center text-white dark:text-white">
    {timer > 0 ? (
      <>Resend OTP in <span className=" text-white dark:text-white">{timer}s</span></>
    ) : (
      "OTP expired"
    )}
  </div>
</form>



                    </div>
                </div>
            </section>
        </div>
    );
}

export default OtpPage;
