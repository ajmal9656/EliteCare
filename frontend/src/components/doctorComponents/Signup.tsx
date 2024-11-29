
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { registerForm } from '../../Redux/Action/doctorActions';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate()
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async(values) => {
      try{
        if(values){
        console.log(values)
        localStorage.removeItem('otp-timer');
        const registrationState =await dispatch(registerForm(values));
        console.log("bbb",registrationState);
        
        if(registrationState.status){
          toast.success("success")
          navigate("/doctor/otp")
        }
        else if(registrationState.message==="Email already in use"){
          toast.error("Email already in use")
          
        }
        else if(registrationState.message==="Phone number already in use"){
          toast.error("Phone number already in use")

        }

      }

      }catch(error:any){
        toast.error(error.message)

      }
      
    },
  });

  return (
    




<div className="contain py-16 bg-cover bg-center" style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1666887364752-29dcc75d6aee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
  <div className="max-w-lg mx-auto shadow px-6 py-7 bg-white bg-opacity-90 rounded overflow-hidden">
    <h2 className="text-2xl uppercase font-medium mb-1">Register</h2>
    <p className="text-gray-600 mb-6 text-sm">Welcome! So good to have you here!</p>
    <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="text-gray-600 mb-2 block">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                className={`block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400`} 
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
          </div>
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
              <label htmlFor="phone" className="text-gray-600 mt-3 mb-2 block">Phone</label>
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                className={`block w-full border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400`} 
                placeholder="Enter your phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
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
                
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label htmlFor="confirmPassword" className="text-gray-600 mt-3 mb-2 block">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  className={`block w-full border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400 `} 
                  placeholder="***********"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
          </div>
          <div className="mt-4">
            <button 
              type="submit" 
              className="w-full block py-2 text-center text-white bg-gradient-to-l from-cyan-500 to-blue-500 border  rounded hover:bg-blue-400  transition uppercase font-roboto font-medium"
            >
              Register
            </button>
          </div>
        </form>
    <p className="mt-4 text-gray-600 text-center">
      Already have an account? 
      <Link to="/doctor/login" className="text-blue-300 ml-2">Login Now</Link>
    </p>
  </div>
</div>

  );
}

export default Signup;
