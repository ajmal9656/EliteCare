import React, { createContext, useContext, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client';
import { RootState } from '../Redux/store';
import { setShowIncomingVideoCall,endCallUser } from '../Redux/Slice/userSlice';
import { endCallDoctor, setRoomId, setShowVideoCall } from '../Redux/Slice/doctorSlice';
import { toast } from 'sonner';




const SocketContext = createContext<any>({ socket: null});


export const useSocket = () => {
  return useContext(SocketContext);
};

// interface SocketProviderProps {
//   children: ReactNode;
// }

export const SocketProvider: React.FC<any> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const userInRedux = useSelector((state:RootState) => state.user)
  const doctorInRedux = useSelector((state:RootState) => state.doctor)
  const loggedUser = userInRedux.userInfo!=null ? userInRedux?.userInfo?._id : doctorInRedux?.doctorInfo?.doctorId
  console.log("afasfgv",doctorInRedux);
  console.log("bfasfgv",userInRedux);
  console.log("cddjdhgfghk",loggedUser);

  const dispatch:any = useDispatch()
  
  

  useEffect(() => {
    // console.log('useEffect working')
    if (loggedUser) {
      console.log("wwww",loggedUser);
      
      const newSocket = io(import.meta.env.VITE_AXIOS_BASE_URL, {
        query: {
          userId: loggedUser
        }
      });

      newSocket.on("connect",()=>{
        console.log("Socket connected",socket);
        setSocket(newSocket);
      })

      //socket .on is used to listen to the events.
    //   newSocket?.on('getOnlineUsers', (users) => {
    //     console.log('users online sare ', users)
    //     setOnlineUsers(users)
    //   })
    

      return () => {
        // newSocket.off('getOnlineUsers')
        newSocket.disconnect();
      };
    } else {
      setSocket(null)
    }
  }, [loggedUser]);

  useEffect(()=>{
    socket?.on('incoming-video-call',(data)=>{
      console.log('Client connected',data)
      dispatch(setShowIncomingVideoCall({ ...data.from, callType: data.callType, roomId: data.roomId,appointmentId:data.appointmentId }))
      // dispatch(setStartVideoCall({ ...data.from, callType: data.callType, roomId: data.roomId }))
    })

    socket?.on('accept-call', (data) => {
      
      dispatch(setRoomId(data.roomId))
      dispatch(setShowVideoCall(true))
  })

  socket?.on('call-rejected', () => {
    if(userInRedux.userInfo===null){
      toast.error("Your call has been rejected")

    }else{

      toast.error("Call ended")
  
    }
    
    dispatch(endCallDoctor())
    dispatch(endCallUser())
})


    return ()=>{
      socket?.off('incoming-video-call')
    }
  },[socket])

  return (
    <SocketContext.Provider value={{ socket}}>
      {children}
    </SocketContext.Provider>
  );
};
