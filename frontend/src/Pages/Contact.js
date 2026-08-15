import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import QuestionMap from '../Components/Contact/Question_map/QuestionMap'
import Newsletter from '../Components/Contact/News_letter/Newsletter'
import ContactBanner from '../Components/Contact/Contact-Banner/ContactBanner'
import { ToastContainer } from 'react-toastify'

function Contact() {
  return (
    <>
        <Navbar />
        <ContactBanner />
        <QuestionMap />
        <Newsletter />
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      
    </>
  )
}

export default Contact
