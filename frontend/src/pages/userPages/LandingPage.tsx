import React from 'react';
import Navbar from '../../components/common/userCommon/Navbar';
import About from '../../components/userComponents/About';
import Services from '../../components/userComponents/Services';
import Blogs from '../../components/userComponents/Blogs';
import Doctors from '../../components/userComponents/Doctors';
import Home from '../../components/userComponents/Home';
import Footer from '../../components/common/userCommon/Footer';


function LandingPage() {
  return (
    <>
    
    <Home/>
    <About/>
    <Services/>
    <Doctors/>
    <Blogs/>
    

    
      
    </>
  )
}

export default LandingPage
