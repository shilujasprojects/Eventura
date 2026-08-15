import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import BookNow from '../Components/Book_Now/BookNow'
import { ToastContainer } from 'react-toastify'


function Book_Now() {
  return (
    <>
    <Navbar />
    <BookNow />
    
    <Footer />  
    <ToastContainer position="top-right" autoClose={3000}/>    
    </>
  )
}

export default Book_Now
