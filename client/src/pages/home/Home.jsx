import React, { useState } from "react";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import RouteService from "../../routes/RouteService";

const Home = () => {
  const [resumeData, setResumeData] = useState([]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;

    if (files.length === 0) {
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("files", file);
    }

    try {
      const response = await RouteService.uploadResume(formData);
      setResumeData(response);
      console.log(response);
    } catch (error) {
      console.error("Error uploading file: " + error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">About</h1>
            <p>
              Talent Manager is a talent recruitment tool designed for
              streamlined resume segmentation and information extraction. Built
              upon cutting-edge Natural Language Processing (NLP) and Named
              Entity Recognition (NER) technologies, Talent Manager
              revolutionizes the hiring process. It automatically parses and
              extracts key details from resumes, facilitating efficient talent
              acquisition and management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
