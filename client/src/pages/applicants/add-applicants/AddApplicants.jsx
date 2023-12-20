import React, { useState } from "react";
import "./addapplicants.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RouteService from "../../../routes/RouteService";

const AddApplicants = () => {
  const [resumeData, setResumeData] = useState([]);
  const [error, setError] = useState("");

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
      if (response.status >= 400 && response.status <= 500) {
        window.location = "/login";
      } else if (response.status >= 500) {
        setError("Error processing resume(s)");
      } else if (response.status == 200) {
        setResumeData(response.data);
        console.log(response.data);
      } else {
        setError("Error processing resume(s)");
      }
    } catch (error) {
      setError("Please try again");
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">
              Process Applicant Resumes
            </h1>
            <label className="btn-primary">
              Upload Resumes
              <input
                type="file"
                name="file"
                id="file"
                className="file-input"
                onChange={handleFileUpload}
                multiple
              />
            </label>
            {error && <div className="error_msg">{error}</div>}
            {Array.isArray(resumeData) && resumeData.length > 0 && (
              <div className="table">
                {resumeData.map((data, dataIndex) => (
                  <table key={dataIndex}>
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Label</th>
                        <th className="px-4 py-2">Text</th>
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

export default AddApplicants;