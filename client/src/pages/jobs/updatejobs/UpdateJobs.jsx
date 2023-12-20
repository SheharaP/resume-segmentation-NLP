import React, { useState } from "react";
import "./updatejobs.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RouteService from "../../../routes/RouteService";

function UpdateJobs() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobExperience, setJobExperience] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const job = {
      jobTitle,
      jobSkills,
      jobExperience,
    };

    try {
        console.log(job);
        const response = await RouteService.addJob(job);
        console.log(response)
    } catch (error) {
        console.error("Error creating job:", error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <h1>Create a Job</h1>
        <div className="manage-jobs-container">
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Job Title:</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Job Skills (Separate by commas):</label>
                <textarea
                  className="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Job Experience:</label>
                <textarea
                  className="text"
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateJobs;
