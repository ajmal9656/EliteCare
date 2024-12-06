import axiosUrl from "../utils/axios";


export const getAppointment=(appointmentId:string)=>{
    return axiosUrl.get(`/getAppointment/${appointmentId}`);


    
}
export const getAppointments=(userId:string,status: string, page: number)=>{
    return axiosUrl
    .get(`/getAppointments/${userId}`, {
      params: { status, page, limit: 3 }, // Adding page and limit to the API request
    })


    
}

export const cancelAppointment=(appointmentId:string)=>{
    return axiosUrl
    .put(`/cancelAppointment/${appointmentId}`)

}

export const createCheckoutSession=(appointmentData:any)=>{
    return axiosUrl.post('/create-checkout-session', {
        appointment: appointmentData,
      });

}


export const addReview=(appointmentId:string|any,reviewText:string,rating:any)=>{
    return axiosUrl.post('/addReview', {
        appointmentId: appointmentId, // Ensure appointment is not null
        rating: rating,
        reviewText: reviewText,
      });

}
export const fetchTwoMembersChat=(doctorId:string,userId:string)=>{
    return axiosUrl.get(`/chat/fetchTwoMembersChat`, { params: { doctorID: doctorId, userID: userId , sender:"USER" } });

}

export const getDoctorDetails=(doctorId:string)=>{
    return axiosUrl.get(`/doctordetails/${doctorId}`, {
        params: { reviewData: true },
      });

}

export const getDoctors=()=>{
    return axiosUrl.get('/getDoctors');

}
export const getDoctorswithSpecialization=(id:string,page:number,search:string)=>{
    return axiosUrl.get(`/getDoctorsWithSpecialization/${id}`, {
        params: { page, limit: 3, search } // Added search query to params
      });

}

export const getSpecializations=()=>{
    return axiosUrl.get("/getSpecializations");

}

export const getSlots=(formattedDate:any,doctorId:string)=>{
    return axiosUrl.get('/getSlots', {
        params: {
          date: formattedDate,
          doctorId: doctorId,
        },
      });

}

export const checKSlotStatus=(selectedSlot:any,formattedDate:any,doctorId:string,userId:string)=>{
    return axiosUrl.post('/checkSlotStatus', {
        slotId: selectedSlot,   
        doctorId: doctorId ,
        date:formattedDate ,
        userId:userId  
      });

}

export const getUserData=(userId:string|undefined)=>{
    return axiosUrl.get(`/getUserDetails/${userId}`,{
        withCredentials: true, // Ensure cookies are included
      });

}

export const endCall=(appointmentId:string)=>{
    return axiosUrl.post('/chat/end-call', {
        appointmentId: appointmentId,
        
    });

}


