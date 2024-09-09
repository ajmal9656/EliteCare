import React from 'react'
import Navbar from '../../components/common/userCommon/Navbar'
import Footer from '../../components/common/userCommon/Footer'
import Specializations from '../../components/userComponents/Specializations'
import Home from '../../components/userComponents/Home'

function SpecializationPage() {
  return (
    <>
      <Navbar/>
      
      <Specializations/>
      <Footer/>
    </>
  )
}

export default SpecializationPage
