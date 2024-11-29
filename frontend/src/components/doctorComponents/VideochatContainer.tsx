
import { useDispatch } from 'react-redux'
import { MdCallEnd } from "react-icons/md";

import { useSocket } from '../../Context/SocketIO';

const VideochatContainer = ({ data }: { data: any }) => {
  const { socket } = useSocket()
  // const [callAccepted,setCallAccepted]=useState<boolean>(false)
  

  const handleEndCall = () => {
    socket?.emit('reject-call', ({ to: data._id }))
    // dispatch(endCall())
  }
  // console.log('data is ',data)
  return (
    <div className=' w-full h-full fixed flex justify-center items-center z-50 top-1'>
      <div className=' w-96   bg-cyan-950 flex justify-center items-center z-50 rounded-xl shadow-2xl shadow-black'>
        <div className='flex flex-col gap-6 items-center'>
          <span className='text-lg text-white mt-3'>
            {/* {callAccepted && data.type != 'video' ? "ongoing" : "calling"} */}
          </span>
          <span className='text-3xl text-white'>{data.name}</span>
          {/* {!callAccepted && data.callType =='audio' && ( */}
          <div className='flex'>
            <img className='w-24 h-24 rounded-full' src={data.profilePic} alt='profile' />
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

export default VideochatContainer