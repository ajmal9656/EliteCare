import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../Redux/store"
import { useSocket } from "../../Context/SocketIO"
import { MdCallEnd } from "react-icons/md"
import { endCallUser, setRoomId, setShowVideoCall} from "../../Redux/Slice/userSlice"


function IncomingVideocall() {

    const { showIncomingVideoCall } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const { socket } = useSocket()

    const handleEndCall = () => {
        socket?.emit('reject-call', ({ to: showIncomingVideoCall?._id }))
        dispatch(endCallUser())
    }

    const handleAcceptCall = () => {

        console.log("showincoming",showIncomingVideoCall);
        
        // dispatch(setVideoCall({
        //     type: "in-coming",
        //     ...showIncomingVideoCall
        // }))
        // socket?.emit('reject-call', ({ to: showIncomingVideoCall?._id }))
        socket?.emit('accept-incoming-call', ({ to: showIncomingVideoCall?._id, roomId: showIncomingVideoCall?.roomId }))

        dispatch(setRoomId(showIncomingVideoCall?.roomId))
        dispatch(setShowVideoCall(true))
    }

  return (
    <>
            <div className='w-full h-full flex justify-center items-center z-40 fixed top-1'>
                <div className='w-96 bg-cyan-950  z-40 rounded-xl flex flex-col items-center shadow-2xl shadow-black'>
                    <div className='flex flex-col gap-7 items-center'>
                        <span className='text-lg text-white  mt-4'>
                            {'Incoming video call'}
                        </span>
                        <span className='text-3xl text-white font-bold'>{showIncomingVideoCall?.name}</span>

                    </div>
                    <div className='flex m-5'>
                        <img className='w-24 h-24 rounded-full' src={showIncomingVideoCall?.profilePic} alt='profile' />
                    </div>
                    <div className='flex m-2  mb-5 gap-7'>

                        <div className='bg-green-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
                            <MdCallEnd onClick={handleAcceptCall} className='text-3xl' />

                        </div>
                        <div className='bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
                            <MdCallEnd onClick={handleEndCall} className='text-3xl' />

                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default IncomingVideocall
