import React from "react";
import './App.css'
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import MCQs from "./pages/Mcqs";
import Resources from "./pages/Resources";
import ExpertHelp from "./pages/ExpertHelp";
import Appointment from "./pages/Appointment"
import AuthPage from "./auth/AuthPage";
import AppointmentInfo from "./pages/AppointmentInfo";

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={isAuthPage ? 'auth-page' : 'app-container'}>
      
      {isAuthPage ? (
        <div className="auth-page-container">
          <AuthPage />
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/mcqs" element={<MCQs/>}/>
                <Route path="/resources" element={<Resources/>}/>
                <Route path="/expert" element={<ExpertHelp/>}/>
                <Route path="/appointment" element={<Appointment/>}/>
                <Route path="/appointments" element={<AppointmentInfo />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
