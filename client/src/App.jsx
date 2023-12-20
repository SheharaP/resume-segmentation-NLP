import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import ViewApplicants from "./pages/applicants/view-applicants/ViewApplicants";
import AddApplicants from "./pages/applicants/add-applicants/AddApplicants";
import MatchJobs from "./pages/jobs/matchjobs/MatchJobs";
import AddJobs from "./pages/jobs/addjobs/AddJobs";
import ViewJobs from "./pages/jobs/viewjobs/ViewJobs";
import Signup from "./pages/auth/Signup/signup";
import Login from "./pages/auth/Login/login";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/process-resumes" element={<AddApplicants />} />
            <Route path="/view-applicants" element={<ViewApplicants />} />
            <Route path="/view-jobs" element={<ViewJobs />} />
            <Route path="/create-job" element={<AddJobs />} />
            <Route path="/match-jobs" element={<MatchJobs />} />
          </>
        ) : (
          <Route path="*" element={<Navigate replace to="/login" />} />
        )}
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
