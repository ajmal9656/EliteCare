


function SlotDisplay() {

    


  return (
    <div className='w-[100%] h-[1500px] md:h-[800px]  flex flex-col bg-gray-100'>
      {/* Doctor's Profile Image */}
      <div className='w-[100%] h-[600px] bg-gradient-to-r from-[#D2EAEF] to-[#86BBF1] flex place-content-center'>
  <div className='w-[16%] h-[230px] mt-16 relative '>
    {/* Display Doctor's Image */}
    <img
      
      alt="sjhgvjs"
      className='w-full h-full object-cover z-10 mt-28 rounded-md'
    />
  </div>
</div>


      {/* Doctor's Details */}
      <div className='w-[100%] h-[1000px]  flex place-content-center '>
        <div className='w-[70%] h-[400px]  flex flex-col justify-center items-center    '>
          <div className='w-[80%] h-[600px] pt-24 bg-white mt-5 shadow-lg shadow-gray-200'>
          
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default SlotDisplay
