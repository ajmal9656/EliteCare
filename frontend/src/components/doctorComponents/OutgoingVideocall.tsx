import { MdCallEnd } from "react-icons/md"
import { useSocket } from "../../Context/SocketIO"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState } from "../../Redux/store"
import { endCallDoctor } from "../../Redux/Slice/doctorSlice"


function OutgoingVideocall() {

    const { videoCall,doctorInfo} = useSelector((state: RootState) => state.doctor)
  const { socket } = useSocket()
  console.log("video",videoCall);
  

  useEffect(() => {
    console.log("ss",videoCall);
    
    if (videoCall?.type == 'out-going') {
      socket?.emit('outgoing-video-call', {
        to: videoCall.userID,
        from: {
          _id: doctorInfo?.doctorId,
          profilePic: videoCall?.doctorImage,
          name: doctorInfo?.name,
          
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId
      })
    }
  }, [videoCall])
  // const [callAccepted,setCallAccepted]=useState<boolean>(false)
  const dispatch = useDispatch()

  const handleEndCall = () => {
    socket?.emit('reject-call', ({ to: videoCall.userID }))
    dispatch(endCallDoctor())
  }
  return (
    <div className=' w-full h-full fixed flex justify-center items-center z-50 top-1'>
    <div className=' w-96   bg-cyan-950 flex justify-center items-center z-50 rounded-xl shadow-2xl shadow-black'>
      <div className='flex flex-col gap-6 items-center'>
        <span className='text-lg text-white mt-3'>
          {/* {callAccepted && data.type != 'video' ? "ongoing" : "calling"} */}
        </span>
        <span className='text-3xl text-white'>{videoCall.name}</span>
        {/* {!callAccepted && data.callType =='audio' && ( */}
        <div className='flex'>
          <img className='w-24 h-24 rounded-full' src={videoCall?.userImage} alt='profile' />
        </div>
        {/* )} */}
        <div className='bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-5'>
          <MdCallEnd onClick={handleEndCall} className='text-3xl' />
        </div>
      </div>
    </div>
  </div>
  )
}

export default OutgoingVideocall
