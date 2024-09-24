
import { UpdateUserProfilePayload } from '../../interfaces/userInterface';
import axiosUrl from '../../utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';




export const registerForm = (userData:{
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmpassword: string,

}):any =>{
    return async  () =>{
        try{
            console.log("sjvsj",userData)
            const response = await axiosUrl.post('/signUp',userData)
            console.log(response.data)
            if(response.status){
                const token = response.data.response.token
                console.log("ccc",token)
                localStorage.setItem('userOtp',token)
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
            const token = localStorage.getItem('userOtp');
            console.log(token)
            const response = await axiosUrl.post('/verifyOtp',{otp},{
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

export const login = createAsyncThunk('user/userLogin',
    async({ email, password }: { email: string; password: string }, { rejectWithValue })=>{
        try{

            const response = await axiosUrl.post('/login',{email,password});
            console.log("login thunk",response.data)
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
            const token = localStorage.getItem('userOtp');
            
            const response = await axiosUrl.post('/resendOtp',{},{
                headers:{
                    'authorization':`Bearer ${token}`
                }
            })
            if(response.data.status){
                localStorage.removeItem('userOtp')
                const tokenNew = response.data.response.token
                console.log("newtok",tokenNew)
                
                localStorage.setItem('userOtp',tokenNew)
                return {status:true}
            }
            return response;
           

        }catch(error:any){
            console.log(error.response.data)
            return error.response.data;

        }
    }

}

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async ({ _id, name, dob, address }: UpdateUserProfilePayload, { rejectWithValue }) => {
      try {
        const response = await axiosUrl.put('/updateUser', {
          _id,
          name,
          DOB:dob,
          address,
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
  export const updateUserProfileImage = createAsyncThunk(
    'user/updateUserProfileImage',
    async (formData: FormData, { rejectWithValue }) => {
      try {
        console.log("form",formData)
        const response = await axiosUrl.put('/updateProfileImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct headers for file upload
          },
        });
  
        console.log('Thunkkkkkksssss response:', response.data.response);
        return response.data.response // Adjust according to your API response structure
      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Update failed';
          console.log('Error response:', errorMessage);
          return rejectWithValue(errorMessage);
        } else if (error.request) {
          return rejectWithValue('No response from server.');
        } else {
          return rejectWithValue(error.message || 'Update failed');
        }
      }
    }
  );