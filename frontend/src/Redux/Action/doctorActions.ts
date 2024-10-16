import { UpdateDoctorProfilePayload } from '../../interfaces/doctorinterface';
import axiosUrl from '../../utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';




export const registerForm = (doctorData:{
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,

}):any =>{
    return async  () =>{
        try{
            console.log("sjvsj",doctorData)
            const response = await axiosUrl.post('/doctor/signUp',doctorData)
            console.log(response.data)
            if(response.status){
                const token = response.data.response.token
                console.log("ccc",token)
                localStorage.setItem('doctorOtp',token)
                return {status:true};
            }
            return response

        }catch(error:any){
            console.log(error)
            return error.response.data;
        }
        
    }
}

export const verifyOtp = (otp:string):any =>{
    return async ()=>{
        try{
            const token = localStorage.getItem('doctorOtp');
            console.log(token)
            const response = await axiosUrl.post('/doctor/verifyOtp',{otp},{
                headers:{
                    'authorization':`Bearer ${token}`
                }
            })
            console.log(response)
            if(response.data.status){
                return {status:true}
            }
            return response;


        }catch(error:any){
            console.log(error.response.data)
            return error.response.data;

        }
    }

}

export const login = createAsyncThunk('doctor/doctorLogin',
    async({ email, password }: { email: string; password: string }, { rejectWithValue })=>{
        try{

            const response = await axiosUrl.post('/doctor/login',{email,password});
            console.log("login thunk",response.data.response)
            return response.data.response



        }catch(error:any){
            if (error.response) {
                
                const errorMessage = error.response.data.message || 'Login failed';
                console.log("vvvvvv",errorMessage)
                return rejectWithValue(errorMessage);
              } else if (error.request) {
                
                return rejectWithValue('No response from server.');
              } else {
                
                return rejectWithValue(error.message || 'Login failed');
              }

        }
    }


)

export const resendOtp = ():any =>{
    return async ()=>{
        try{
            const token = localStorage.getItem('doctorOtp');
            
            const response = await axiosUrl.post('/doctor/resendOtp',{},{
                headers:{
                    'authorization':`Bearer ${token}`
                }
            })
            if(response.data.status){
                localStorage.removeItem('doctorOtp')
                const tokenNew = response.data.response.token
                console.log("newtok",tokenNew)
                
                localStorage.setItem('doctorOtp',tokenNew)
                return {status:true}
            }
            return response;
           

        }catch(error:any){
            console.log(error.response.data)
            return error.response.data;

        }
    }

}
export const logoutDoctor = createAsyncThunk(
    'doctor/logoutDoctor',
    async (_, { rejectWithValue }) => { // Include rejectWithValue in the argument list
      try {
        const response = await axiosUrl.post('/doctor/logout', {}, { 
          withCredentials: true // Send cookies with the request
        });
  
        return response.data;
      } catch (error:any) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Logout failed';
          console.error('Logout error:', errorMessage);
          return rejectWithValue(errorMessage);
        } else if (error.request) {
          return rejectWithValue('No response from server.');
        } else {
          return rejectWithValue(error.message || 'Logout failed');
        }
      }
    }
  );

  export const updateDoctorProfile = createAsyncThunk(
    'doctor/updateDoctorProfile',
    async ({ doctorId, DOB, fees, phone }: UpdateDoctorProfilePayload, { rejectWithValue }) => {
      try {
        const response = await axiosUrl.put('/doctor/updateDoctor', {
          _id:doctorId,
          DOB,
          fees,
          phone,
        });
  
        console.log("Thunkkkk response:", response.data.response);
        return response.data.response; // Adjust according to your API response structure
      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Update failed';
          console.log("Error response:", errorMessage);
          return rejectWithValue(errorMessage);
        } else if (error.request) {
          return rejectWithValue('No response from server.');
        } else {
          return rejectWithValue(error.message || 'Update failed');
        }
      }
    }
  );