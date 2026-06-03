// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyA4xDsXT9Y_LNlSEqFJ562EFnR5ENR9dQk",
  authDomain: "eventura-booking.firebaseapp.com",
  projectId: "eventura-booking",
  storageBucket: "eventura-booking.firebasestorage.app",
  messagingSenderId: "756212321235",
  appId: "1:756212321235:web:4afe0f09f170bdfe21fd26",
  measurementId: "G-TGRCYQJL1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);