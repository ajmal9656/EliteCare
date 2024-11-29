import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoomId, setShowVideoCall, setVideoCall } from '../../Redux/Slice/doctorSlice';
import { RootState } from '../../Redux/store';
import { useSocket } from '../../Context/SocketIO';

import axiosUrl from '../../utils/axios';



function VideoChat() {
  let {socket} = useSocket();
  const videoCallRef = useRef(null)
  const { roomIdDoctor,videoCall} = useSelector((state: RootState) => state.doctor)
  const dispatch = useDispatch()
  


  console.log("vid",videoCall);
  


  

  useEffect(() => {
    // const incomingcalluserid = incomingVideoCall?._id
    const appId= parseInt(import.meta.env.VITE_APP_ID)
    
    
    
    const serverSecret=import.meta.env.VITE_ZEGO_SECRET
    console.log("apps",serverSecret);

    //@ts-ignore
    const roomIdStr = roomIdDoctor.toString()
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomIdStr, Date.now().toString(), "Doctor");
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
        container: videoCallRef.current,
        scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call scenario
        },
        turnOnMicrophoneWhenJoining: true, // Automatically turn on the microphone when joining
        turnOnCameraWhenJoining: true, // Automatically turn on the camera when joining
        showPreJoinView: false, // Skip the pre-join view
        onLeaveRoom: () => {
            socket?.emit('leave-room', ({ to: videoCall.userID }));
            // This callback is called when the user leaves the room 
            dispatch(setShowVideoCall(false))
            dispatch(setRoomId(null))
            dispatch(setVideoCall(null))
            console.log("videosss",videoCall);
        
        axiosUrl.post('/chat/end-call', {
          appointmentId: videoCall?.appointmentId,
          
      });
            
        },
    });

    socket?.on('user-left', () => {
        // Leave the Zego room and navigate to the previous route
        zp.destroy();
        // navigate(-1);
        dispatch(setShowVideoCall(false))
        dispatch(setRoomId(null))
        dispatch(setVideoCall(null))
        // dispatch(setIncomingVideoCall(null))
        
        localStorage.removeItem('roomId')
        localStorage.removeItem('showVideoCall')
    });

    // Cleanup when the component unmounts
    return () => {
        zp.destroy(); // Use destroy method to clean up the instance
    };
}, [roomIdDoctor]);

      
  return (
    <div className='w-screen bg-black h-screen absolute z-[100]' ref={videoCallRef}></div>
  )
}

export default VideoChat
