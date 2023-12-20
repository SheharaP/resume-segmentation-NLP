import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import RouteService from "../../../routes/RouteService";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import './viewapplicants.scss'

const ViewApplicants = () => {
  const [resumeData, setResumeData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [allDesignations, setAllDesignations] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    const skillsFromResumes = responseData
      .map((data) => data.skills)
      .filter((skills) => Array.isArray(skills))
      .flat();
    const uniqueSkills = [...new Set(skillsFromResumes)];
    setAllSkills(uniqueSkills);

    const designationsFromResumes = responseData
      .map((data) => data.designation)
      .filter((designation) => Array.isArray(designation))
      .flat();
    const uniqueDesignations = [...new Set(designationsFromResumes)];
    setAllDesignations(uniqueDesignations);
  }, [responseData]);

  const loadResumes = async () => {
    const response = await RouteService.getResumes();
    console.log(response);
    setResponseData(response);
    setResumeData(response);
  };

  const deleteResume = async (resumeId) => {
    const response = await RouteService.deleteResume(resumeId);
    console.log(response);
    loadResumes();
  };

  const handleFilter = async () => {
    console.log(selectedSkills);
    console.log(selectedDesignation);

    if (selectedSkills.length === 0 && selectedDesignation.length === 0) {
      return;
    }
    const response = await RouteService.filterResumes(
      selectedSkills.length > 0 ? selectedSkills : null,
      selectedDesignation.length > 0 ? selectedDesignation : null
    );
    setResumeData(response);
  };

  const handleSkillSelect = (event) => {
    setSelectedSkills(event.target.value);
  };

  const handleDesignationSelect = (event) => {
    setSelectedDesignation(event.target.value);
  };

  const clearFilter = async () => {
    setSelectedSkills([]);
    setSelectedDesignation([]);
    loadResumes();
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <div className="widgets">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">
              View Applicant Resumes
            </h1>
            <div className="select-container">
              <Select
                multiple
                value={selectedSkills}
                onChange={handleSkillSelect}
              >
                {allSkills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                value={selectedDesignation}
                onChange={handleDesignationSelect}
              >
                {allDesignations.map((designation) => (
                  <MenuItem key={designation} value={designation}>
                    {designation}
                  </MenuItem>
                ))}
              </Select>
              <button className="btn-primary" onClick={handleFilter}>
                Filter Resumes
              </button>
              <button className="btn-primary" onClick={clearFilter}>
                Clear
              </button>
            </div>
            {resumeData.length > 0 && (
              <div className="table">
                {resumeData.map((data, dataIndex) => (
                  <table key={dataIndex}>
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Label</th>
                        <th className="px-4 py-2">
                          <div className="about">
                            Text
                            <div className="delete-icon">
                              <DeleteIcon onClick={() => {
                                deleteResume(data._id)
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

export default ViewApplicants;
