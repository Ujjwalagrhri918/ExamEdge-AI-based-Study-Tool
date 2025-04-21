import React from "react";
import './App.css'
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import MCQs from "./pages/Mcqs";
import Resources from "./pages/Resources";
import ExpertHelp from "./pages/ExpertHelp";

const App = () => {
  return (
    <>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/summary" element={<Summary />} />
              <Route path ="/mcqs" element={<MCQs/>}/>
              <Route path ="/resources" element={<Resources/>}/>
              <Route path ="/expert" element={<ExpertHelp/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
