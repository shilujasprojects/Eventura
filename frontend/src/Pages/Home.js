import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import Banner from '../Components/Home/Banner/Banner'
import ClientTestimonials from '../Components/Home/Client-testimonials/ClientTestimonials'
import FounderSection from '../Components/Home/Founder-section/FounderSection'
import MainBanner from '../Components/Home/Main-banner/MainBanner'
import ServiceCard from '../Components/Home/Service-Card/ServiceCard'
import { ToastContainer } from 'react-toastify'


export default function Home() {
  return (
    <>
        <Navbar />
        <MainBanner />
        <FounderSection />
        <ServiceCard />
        
        <ClientTestimonials />
        <Banner />
        
        
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
