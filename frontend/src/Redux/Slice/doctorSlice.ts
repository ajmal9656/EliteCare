import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { login } from "../Action/doctorActions";
import { Doctor,DoctorState } from "../../interfaces/doctorinterface";


const initialState: DoctorState = {
    doctorInfo: null,
    accessToken: null,
    loading: false,
    error: null,
    docStatus:"pending"
    
  };

const doctorSlice = createSlice({
    name:"Doctor",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(login.fulfilled,(state,action:PayloadAction<{ accessToken: string; doctorInfo: Doctor }>)=>{
        const { accessToken, doctorInfo } = action.payload;
        state.doctorInfo = doctorInfo;
        state.accessToken = accessToken;  
        state.loading = false;
        state.docStatus = doctorInfo.docStatus

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));

        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Login failed';
          })

    }
})

export default doctorSlice.reducer