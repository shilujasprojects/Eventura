import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import Faq from '../Components/Our_Story/FAQ/Faq'
import AboutBanner from '../Components/Our_Story/About-Banner/AboutBanner'
import BannerReady from '../Components/Our_Story/Banner-ready/BannerReady'
import MissionVision from '../Components/Our_Story/Mission-vision/MissionVision'
import WhoWeAre from '../Components/Our_Story/Who-we-are/WhoWeAre'
import WhyEventura from '../Components/Our_Story/Why-choose-eventura/WhyEventura'
import { ToastContainer } from 'react-toastify'

function Our_Story() {
  return (
    <>
           <Navbar />
           <AboutBanner />
           <WhoWeAre />
           <MissionVision />
           <WhyEventura />
           <Faq />
           <BannerReady />
           <Footer />
           <ToastContainer position="top-right" autoClose={3000} />
      
    </>
  )
}

export default Our_Story
