import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../Redux/store';
import { toast } from "sonner";
import { login } from "../../Redux/Action/adminActions";

function AdminLogin() {


  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: Yup.object({
          email: Yup.string().email('Invalid email address').required('Email is required'),
          password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        }),
        onSubmit: async(values) => {
          
          try {
            console.log(values);
            const loginData = await dispatch(login(values)).unwrap();
            if(loginData){
              console.log("logggg success",loginData);
              
                toast.success("admin login successful");
                navigate("/admin/dashboard")
              
              
    
            }
    
            
    
          } catch (error: any) {
            
            console.error(error);
            toast.error(error || "An error occurred");
          }
        },
      });
      

  return (
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light">Login to your account</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-gray-800 rounded-t-md"></div>
          <form onSubmit={formik.handleSubmit} className="px-8 py-6">
            <div>
              <label htmlFor="email" className="block font-semibold">Username or Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className={`border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:gray-900 focus:ring-1 rounded-md ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block font-semibold">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className={`border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:gray-900 focus:ring-1 rounded-md ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="flex justify-between items-baseline">
              <button type="submit" className="mt-4 bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-900">
                Login
              </button>
              <Link to="/forgot-password" className="text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
