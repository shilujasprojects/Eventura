import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import EventuraService from '../Components/Services/Eventura-Service/EventuraService'
import HowItWorks from '../Components/Services/How-It-Works/HowItWorks'
import OurService from '../Components/Services/Our-Service/OurService'
import ServiceBanner from '../Components/Services/Service-Banner/ServiceBanner'
import TextBanner from '../Components/Services/Text-Banner/TextBanner'

export default function Services() {
  return (
    <>
        <Navbar />
        <ServiceBanner />
        <OurService />
        <HowItWorks />
        <EventuraService />
        <TextBanner />
        <Footer />
      
    </>
  )
}
