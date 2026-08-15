import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import AboutEvent from '../Components/Events/About-Event/AboutEvent'
import CarouselBanner from '../Components/Events/Carousel-Banner/CarouselBanner'
import RecentEvents from '../Components/Events/Recent-Events/RecentEvents'
import { ToastContainer } from 'react-toastify'

const Events = () => {
  return (
    <>
        <Navbar />
        <CarouselBanner />
        <AboutEvent />
        <RecentEvents />
        <Footer />   
        <ToastContainer position="top-right" autoClose={3000} />   
    </>
  )
}

export default Events
