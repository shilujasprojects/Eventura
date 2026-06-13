
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home';
import Events from './Pages/Events';
import Services from './Pages/Services'
import Story from './Pages/Our_Story'
import AOS from 'aos'
import React, { useEffect } from 'react';
import Contact from './Pages/Contact';
import BookNow from './Pages/Book_Now';
import BookSummary from './Components/Book_Now/BookSummary';
import WeddingExplore from './Components/Home/Event-Explore/Wedding-Explore/WeddingExplore';
import BirthdayExplore from './Components/Home/Event-Explore/Birthday-Explore/BirthdayExplore ';
import FuneralExplore from './Components/Home/Event-Explore/Funeral-Explore/FuneralExplore';
import BabyShowerExplore from './Components/Home/Event-Explore/BabyShower-Explore/BabyShowerExplore';
import Auth from './Components/Auth/Auth';

import EngagementExplore from './Components/Home/Event-Explore/Engagement-Explore/EngagementExplore';
import HousewarmingExplore from './Components/Home/Event-Explore/HouseWarming-Explore/HousewarmingExplore';
import AnniversaryExplore from './Components/Home/Event-Explore/Anniversary-Explore/AnniversaryExplore';
import CorporateExplore from './Components/Home/Event-Explore/Corporate-Explore/CorporateExplore';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminCategoryEvent from './Pages/Admin/CategoryEvent/CategoryEvent';
import AddCategoryEvent from './Pages/Admin/CategoryEvent/AddCategoryEvent';
import AdminEvent from './Pages/Admin/Events/Event';
import AddEvent from './Pages/Admin/Events/AddEvent';
import AdminPackage from './Pages/Admin/Packages/Package';
import AddPackage from './Pages/Admin/Packages/AddPackage';
import AdminService from './Pages/Admin/Services/Service'
import AddService from './Pages/Admin/Services/AddService';
import ViewService from './Admin/Services/ViewServices';
import EditService from './Admin/Services/EditServices';



function App() {

  useEffect(() => {
      AOS.init({
        duration: 1000, 
        once: false,    
      });
      AOS.refresh(); 
    }, []);

  return (
    <>
      <Routes>
            <Route path ='/' element={<Home />} />
            <Route path='/loginSign' element={<Auth />} />
           
            <Route path ='/events' element={<Events />} />
            <Route path ='/services' element={<Services />} />
            <Route path ='/about' element={<Story />} />
            <Route path ='/contact' element={<Contact />} />
            <Route path = '/bookNow' element={<BookNow />} />
            <Route path = '/bookSummary' element={<BookSummary />} />
            <Route path = '/birthday-explore' element={<BirthdayExplore />} />
            <Route path= '/wedding-explore' element={<WeddingExplore/>} />
            <Route path='/engagement-explore' element={<EngagementExplore /> } />
            <Route path = '/funeral-explore' element={<FuneralExplore />} />
            <Route path = '/babyshower-explore' element={<BabyShowerExplore />} />
            <Route path='/housewarming-explore' element={<HousewarmingExplore />} />
            <Route path='/anniversary-explore' element={<AnniversaryExplore />} />
            <Route path='/corporate-explore' element={<CorporateExplore /> } />
            <Route path='/adminDashboard' element={<AdminDashboard /> } />
            <Route path='/adminCategoryEvent' element={<AdminCategoryEvent />}/>
            <Route path='/addCategoryEvent' element={<AddCategoryEvent />} />
            <Route path='/adminEvents' element={<AdminEvent />} />
            <Route path='/addEvents' element={<AddEvent />} />
            <Route path='/adminPackages' element={<AdminPackage />} />
            <Route path='/addPackage' element={<AddPackage />} />
            <Route path='/adminServices' element={<AdminService />}/>
            <Route path='/addService' element={<AddService />} />
            <Route path='/viewService/:id' element={<ViewService />} />
            <Route path="/editService/:id" element={<EditService />} />
           
        </Routes>
      
    </>
  );
}

export default App;
