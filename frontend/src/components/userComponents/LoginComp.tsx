import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, UseDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Redux/Action/userActions';
import { AppDispatch } from '../../Redux/store';
import { toast } from 'sonner';
import image from '../../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg';
import { Link } from 'react-router-dom';





function LoginComp() {

  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate()

    const validationSchema = Yup.object({
        email: Yup.string()
          .email('Invalid email address')
          .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
          .required('Email is required'),
        password: Yup.string()
          .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character')
          .required('Password is required'),
      });
    
      const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
          try {
            console.log(values);
            const loginData = await dispatch(login(values)).unwrap();
            if(loginData){
              console.log("logggg success",loginData.userInfo);
              if(loginData.userInfo.isBlocked){
                toast.error("user is blocked")
              }else{
                toast.success("login successful");
                navigate("/")
              }
              

            }

            
    
          } catch (error: any) {
            
            console.error(error);
            toast.error(error || "An error occurred");
          }
        },
      });
  return (
    <div className="relative bg-center  mt-0 min-h-screen">
      <div className='absolute -z-10 h-full overflow-hidden '>
        <div className='absolute bg-[#c8ebc51f] w-full h-full' ></div>
        <img src={image} alt="" className='w-screen object-contain' />
      </div>
      <section className="flex flex-row justify-center items-end py-10  " >
        <div
         className="w-full bg-[#ffffff24] rounded-lg shadow  md:mt-32 sm:max-w-md xl:p-0  ">
          <div className="p-6  space-y-4 md:space-y-6 sm:p-8 ">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Login
            </h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[37px] bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter email"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[37px] bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-600">{formik.errors.password}</div>
                ) : null}
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-backgroundColor hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-backgroundColor dark:hover:bg-[#4ca992]"
              >
                Submit
              </button>
              <p className="text-sm font-light text-trbg-transparent0 dark:text-gray-700 text-center">
                Don't have an account?{' '}
                <Link 
  className="font-medium text-backgroundColor hover:underline hover:text-[#4ca992]"
  to="/signup"
>
  Sign in here
</Link>
              </p>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoginComp
