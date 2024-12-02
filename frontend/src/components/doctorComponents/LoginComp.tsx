
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../Redux/store';
import { toast } from 'sonner';
import { login } from '../../Redux/Action/doctorActions';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from "react-icons/go";

function LoginComp() {



  const [showPassword, setShowPassword] = useState(false);
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
        password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('Password is required'),
    }),
    onSubmit:async (values) => {
      try {
        console.log(values);
        const loginData = await dispatch(login(values)).unwrap();
        if(loginData){
          console.log("logggg success",loginData);
          if(loginData.doctorInfo.isBlocked){
            toast.error("Doctor is blocked")
          }else{
            toast.success("login successful");
            navigate("/doctor/")
          }
          

        }

        

      } catch (error: any) {
        
        console.error(error);
        toast.error(error || "An error occurred");
      }
    },
  });

  return (
    <div
  className="flex items-center justify-center min-h-screen bg-gray-100"
  style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1666887364752-29dcc75d6aee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="max-w-lg w-full mx-4 shadow px-6 py-7 rounded overflow-hidden bg-white">
    <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
    <p className="text-gray-600 mb-6 text-sm">Welcome! So good to have you back!</p>
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <div className="space-y-2">
        <div>
          <label htmlFor="email" className="text-gray-600 mt-3 mb-2 block">Email address</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className={`block w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400`} 
            placeholder="youremail.@domain.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <label htmlFor="password" className="text-gray-600 mt-3 mb-2 block">Password</label>
          <div className="relative">
  
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    id="password"
    className={`block w-full border ${
      formik.touched.password && formik.errors.password
        ? "border-red-500"
        : "border-gray-300"
    } px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400 pr-10`}
    placeholder="***********"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <div
    className="   cursor-pointer absolute inset-y-0 right-0 flex items-center px-8 text-gray-600 border-l border-gray-300"
    onClick={togglePasswordVisibility}
  >
    {showPassword ? (
      <GoEyeClosed />
      
    ) : (
      <GoEye />
      
    )}
  </div>
  
</div>

          
        </div>
        {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          ) : null}
      </div>
      
      <div className="mt-4">
        <button 
          type="submit" 
          className="w-full block py-2 text-center text-white bg-gradient-to-l from-cyan-500 to-blue-500 border  rounded hover:bg-blue-400  transition uppercase font-roboto font-medium"
        >
          Login
        </button>
      </div>
    </form>
    <p className="mt-4 text-gray-600 text-center">
      Don't have an account? 
      <Link to="/doctor/signup"  className="text-blue-300  ml-2">Register Now</Link>
    </p>
  </div>
</div>

  );
}

export default LoginComp;
