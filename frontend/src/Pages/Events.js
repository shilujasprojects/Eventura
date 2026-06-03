import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import AboutEvent from '../Components/Events/About-Event/AboutEvent'
import CarouselBanner from '../Components/Events/Carousel-Banner/CarouselBanner'
import RecentEvents from '../Components/Events/Recent-Events/RecentEvents'

const Events = () => {
  return (
    <>
        <Navbar />
        <CarouselBanner />
        <AboutEvent />
        <RecentEvents />
        <Footer />      
    </>
  )
}

export default Events
