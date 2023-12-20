import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewjobs.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RouteService from "../../../routes/RouteService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewJobs = () => {
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadJobs();
  }, []);
  
  const deleteJob = async (jobId) => {
    const response = await RouteService.deleteJob(jobId);
    console.log(response);
    loadJobs();
  };

  const loadJobs = async () => {
    const response = await RouteService.getJobs();
    console.log(response);
    setResponseData(response);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">View Available Jobs</h1>
            <button
              className="create-button"
              onClick={() => navigate("/create-job")}
            >
              Create Job
            </button>
            {responseData.length > 0 && (
              <div className="table">
                {responseData.map((data, dataIndex) => (
                  <table key={dataIndex}>
                    <thead>
                      <tr>
                        <th className="title px-4 py-2">Title</th>
                        <th className="px-4 py-2">
                          <div className="about">
                            About
                            <div className="delete-icon">
                              <DeleteIcon onClick={() => {
                                deleteJob(data._id)
                                }}></DeleteIcon>
                            </div>
                          </div>
                        </th>
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

export default ViewJobs;
