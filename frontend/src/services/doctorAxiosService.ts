import axiosUrl from "../utils/axios";


export const cancelAppointment=(appointmentId:string,reason:string)=>{
   
    
    return axiosUrl
    .put("/doctor/cancelAppointment", {
      appointmentId: appointmentId,
      reason: reason,
    })
    
}

export const addPrescription=(appointmentId:string,prescription:string)=>{
    
    
    return axiosUrl
    .put("/doctor/addPrescription", {
      appointmentId: appointmentId, // Passing appointment ID
      prescription: prescription, // Passing prescription details
    })
    
}

export const getMedicalrecords=(userId:string)=>{
    
    
    return axiosUrl.get(
        `/doctor/getMedical-records/${userId}`
      );
    
}

export const getAppointments=(doctorId:string|any,params:any)=>{
    
    
    return axiosUrl.get(`/doctor/getAppointments/${doctorId}`, { params });
    
}

export const fetchTwoMembersChat=(doctorId:string|undefined,userId:string|undefined)=>{
    
    
    return axiosUrl.get(`/chat/fetchTwoMembersChat`, {
        params: {
          doctorID: doctorId,
          userID: userId,
          sender: "DOCTOR",
        },
      });
    
}

export const getDashboardData=(doctorId:string|undefined)=>{
    
    
    return axiosUrl.get('/doctor/dashboardData', {
        params: { doctorId:doctorId }, 
      });
    
}

export const getSpeacializations=()=>{
    
    
    return axiosUrl.get('/admin/getSpecializations');
    
}

export const uploadApplicationData=(formData:any)=>{
    
    
    return axiosUrl.post('/doctor/uploadDoctorData', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
}

export const getDoctorDetails=(doctorId:string|any)=>{
    
    
    return axiosUrl.get(
        `/doctor/getDoctorDetails/${doctorId}`,
        {
          params: { reviewData: true },
        }
      );
    
}

export const createSlot=(formData:any)=>{
    
    
    return axiosUrl.post('/doctor/createSlot', formData);
    
}

export const checkSlotAvailabile=(timeSlots:any,startDate:any,endDate:any,doctorId:any)=>{
    
    
    return axiosUrl.post('/doctor/checkSlotAvailability', {
        timeSlots:timeSlots,
        startDate: startDate,
        endDate: endDate,
        doctorId: doctorId,
      });
    
}

export const getSlots=(date:string|any,doctorId:string|undefined)=>{
    
    
    return axiosUrl.get(`/doctor/getSlots`, {
        params: {
          date: date, 
          doctorId: doctorId,
        },
      });
    
}

export const deleteSlot=(slotId:string,date:string|any,doctorId:string|undefined)=>{
    
    
    return axiosUrl.delete(`/doctor/deleteSlot`, {
        params: { slotId, date, doctorId }
      });
    
}

export const endCall=(appointmentId:string)=>{
    
    
    return axiosUrl.post('/chat/end-call', {
        appointmentId: appointmentId,
        
    });
    
}

export const getWallet=(doctorId:string,status:string,page:number)=>{
    
    
    return axiosUrl.get(`/doctor/getWallet/${doctorId}`, {
        params: { status, page, limit: 7 }
      });
    
}
export const withdraw=(doctorId:string|any,withdrawAmount:number|string)=>{
    
    
    return axiosUrl.post(`/doctor/withdraw/${doctorId}`, {
              
        withdrawAmount: withdrawAmount,
      });
    
}