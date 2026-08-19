
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
// import WeddingExplore from './Components/Home/Event-Explore/Wedding-Explore/WeddingExplore';
// import BirthdayExplore from './Components/Home/Event-Explore/Birthday-Explore/BirthdayExplore ';
// import FuneralExplore from './Components/Home/Event-Explore/Funeral-Explore/FuneralExplore';
// import BabyShowerExplore from './Components/Home/Event-Explore/BabyShower-Explore/BabyShowerExplore';
import Auth from './Components/Auth/Auth';

import "react-toastify/dist/ReactToastify.css";

// import EngagementExplore from './Components/Home/Event-Explore/Engagement-Explore/EngagementExplore';
// import HousewarmingExplore from './Components/Home/Event-Explore/HouseWarming-Explore/HousewarmingExplore';
// import AnniversaryExplore from './Components/Home/Event-Explore/Anniversary-Explore/AnniversaryExplore';
// import CorporateExplore from './Components/Home/Event-Explore/Corporate-Explore/CorporateExplore';
import DashboardCards from './Admin/Shared/DashboardCards';
import ViewCategoryEvents from './Admin/Categories/ViewCategoryEvents';
import EditCategoryEvents from './Admin/Categories/EditCategoryEvents';
import AllCategoryEvents from './Admin/Categories/AllCategoryEvents';
import AddCategoryEvents from './Admin/Categories/AddCategoryEvents';
import AllEvents from './Admin/Events/AllEvents';
import AddEvents from './Admin/Events/AddEvents';
import EditEvent from './Admin/Events/EditEvents';
import ViewEvents from './Admin/Events/ViewEvents';
import AllPackages from './Admin/Packages/AllPackages';
import AddPackages from './Admin/Packages/AddPackages';
import AllServices from './Admin/Services/AllServices';
import AddServices from './Admin/Services/AddServices';
import ViewService from './Admin/Services/ViewServices';
import EditService from './Admin/Services/EditServices';
import ViewPackages from './Admin/Packages/ViewPackages';
import EditPackages from './Admin/Packages/EditPackages';

import ManageBookings from './Admin/Bookings/ManageBookings';
import ManageClients from './Admin/Clients/ManageClients';
import ManagePayments from './Admin/Payments/ManagePayments';
import ManageVendors from './Admin/Vendors/ManageVendors';

import AddVendors from './Admin/Vendors/AddVendors';
import EditVendor from './Admin/Vendors/EditVendors';
import ReportsAnalytics from './Admin/Reports_Analytics/ReportsAnalytics';

import ManageCMS from './Admin/Content_CMS/ManageCMS';
import ManageInquiries from './Admin/Inquiries_Support/ManageInquiries';
import ManageSettings from './Admin/Settings/ManageSettings';
import ClientInquiryForm from './Components/Inquiries_Form/ClientInquiryForm';
import ClientMyInquiries from './Components/Profile/ClientMyInquiries';
import ClientDashboard from './Components/Client_Dashboard/ClientDashboard';
import MakePayment from './Components/Payments/MakePayment';
import NotificationsPage from './Admin/Notifications/NotificationsPage';
import AdminProtectedRoute from './utils/AdminProtectedRoute';
import CategoryExplore from './Pages/CategoryExplore/CategoryExplore';
import ViewMoreEvents from './Components/Events/Recent-Events/ViewMoreEvents';









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
            <Route path='/view-more' element={<ViewMoreEvents />}/>
            <Route path ='/services' element={<Services />} />
            <Route path ='/about' element={<Story />} />
            <Route path ='/contact' element={<Contact />} />
            <Route path = '/bookNow' element={<BookNow />} />
            <Route path = '/bookSummary' element={<BookSummary />} />
            {/* <Route path = '/birthday-explore' element={<BirthdayExplore />} /> */}
            {/* <Route path= '/wedding-explore' element={<WeddingExplore/>} />
            <Route path='/engagement-explore' element={<EngagementExplore /> } />
            <Route path = '/funeral-explore' element={<FuneralExplore />} />
            <Route path = '/babyshower-explore' element={<BabyShowerExplore />} />
            <Route path='/housewarming-explore' element={<HousewarmingExplore />} />
            <Route path='/anniversary-explore' element={<AnniversaryExplore />} />
            <Route path='/corporate-explore' element={<CorporateExplore /> } /> */}
            <Route path="/explore/:categoryId" element={<CategoryExplore />} />

           <Route path='/inquiryForm' element={<ClientInquiryForm /> } />
           <Route path='/clientResponse' element={<ClientMyInquiries /> } />
          
           <Route path='/clientDashboard' element={<ClientDashboard /> } />
           <Route path="/payment/:bookingId" element={<MakePayment />} />
           


           {/* =========================================
            ADMIN ROUTES - Protected by AdminProtectedRoute
           ========================================= */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/adminDashboard" element={<DashboardCards />} />
          
          {/* Category Events */}
          <Route path="/adminCategoryEvent" element={<AllCategoryEvents />} />
          <Route path="/addCategoryEvent" element={<AddCategoryEvents />} />
          <Route path="/viewCategoryEvent/:id" element={<ViewCategoryEvents />} />
          <Route path="/editCategoryEvent/:id" element={<EditCategoryEvents />} />
          
          {/* Events */}
          <Route path="/adminEvents" element={<AllEvents />} />
          <Route path="/addEvents" element={<AddEvents />} />
          <Route path="/viewEvents/:id" element={<ViewEvents />} />
          <Route path="/editEvents/:id" element={<EditEvent />} />
          
          {/* Packages */}
          <Route path="/adminPackages" element={<AllPackages />} />
          <Route path="/addPackage" element={<AddPackages />} />
          <Route path="/viewPackage/:id" element={<ViewPackages />} />
          <Route path="/editPackage/:id" element={<EditPackages />} />
          
          {/* Services */}
          <Route path="/adminServices" element={<AllServices />} />
          <Route path="/addService" element={<AddServices />} />
          <Route path="/viewService/:id" element={<ViewService />} />
          <Route path="/editService/:id" element={<EditService />} />
          
          {/* Management & Settings */}
          <Route path="/bookings" element={<ManageBookings />} />
          <Route path="/clients" element={<ManageClients />} />
          <Route path="/payments" element={<ManagePayments />} />
          <Route path="/vendors" element={<ManageVendors />} />
          <Route path="/addVendors" element={<AddVendors />} />
          <Route path="/editVendors/:id" element={<EditVendor />} />
          <Route path="/reports" element={<ReportsAnalytics />} />
          <Route path="/Cms" element={<ManageCMS />} />
          <Route path="/support" element={<ManageInquiries />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<ManageSettings />} />
        </Route>
        </Routes>
      
    </>
  );
}

export default App;
