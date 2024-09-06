
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../Redux/store';
import { toast } from 'sonner';
import { login } from '../../Redux/Action/doctorActions';
import { Link } from 'react-router-dom';

function LoginComp() {


  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate()



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
            navigate("/doctor/home")
          }
          

        }

        

      } catch (error: any) {
        
        console.error(error);
        toast.error(error || "An error occurred");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
                  type="password" 
                  name="password" 
                  id="password" 
                  className={`block w-full border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400`} 
                  placeholder="***********"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-8 text-gray-600 border-l border-gray-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5"
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              type="submit" 
              className="w-full block py-2 text-center text-white bg-teal-500 border border-teal-500 rounded hover:bg-transparent hover:text-teal-500 transition uppercase font-roboto font-medium"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-gray-600 text-center">
          Don't have an account? 
          <Link to="/doctor/signup"  className="text-teal-500 ml-2">Register Now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginComp;
