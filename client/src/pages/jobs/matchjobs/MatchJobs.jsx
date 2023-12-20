import React, { useState, useEffect } from "react";
import "./matchjobs.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RouteService from "../../../routes/RouteService";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const MatchJobs = () => {
  const [responseData, setResponseData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const response = await RouteService.getJobs();
    console.log(response);
    setResponseData(response);
  };

  useEffect(() => {
    const uniqueJobTitles = new Set(responseData.map((data) => data.jobTitle));
    const uniqueJobTitlesArray = Array.from(uniqueJobTitles);
    console.log(uniqueJobTitlesArray);
    setAllJobs(uniqueJobTitlesArray);
  }, [responseData]);

  const handleJobSelect = (event) => {
    setSelectedJobs(event.target.value);
  };

  const handleFilter = async () => {
    console.log(selectedJobs);

    if (selectedJobs.length === 0) {
      return;
    }
    const response = await RouteService.matchJobs(selectedJobs);
    console.log(response);
    setMatchData(response);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">
              Get applicant matches for jobs
            </h1>
            <div className="select-container">
              <Select multiple value={selectedJobs} onChange={handleJobSelect}>
                {allJobs.map((job) => (
                  <MenuItem key={job} value={job}>
                    {job}
                  </MenuItem>
                ))}
              </Select>
              <button className="filter-button" onClick={handleFilter}>
                Find Resumes
              </button>
            </div>
            {matchData.length > 0 && (
              <div className="table">
                {matchData.map((data, dataIndex) => (
                  <table key={dataIndex}>
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">About</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(data).map((label, labelIndex) => (
                        <tr key={dataIndex + labelIndex}>
                          <td>{label}</td>
                          <td>
                            {Array.isArray(data[label])
                              ? data[label].join(", ")
                              : data[label]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchJobs;
