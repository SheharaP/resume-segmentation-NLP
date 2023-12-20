import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
const token = localStorage.getItem("token");

class RouteService {
  async uploadResume(formData) {
    try {
      const response = await axios.post(
        `${BASE_URL}/process-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      const errorStatus = error.response.status;
      return errorStatus;
    }
  }
  async getResumes() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/get-resumes`, config);

      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }

  async filterResumes(skillsFilter, designationFilter) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const encodedSkillsFilter = encodeURIComponent(skillsFilter);
      const encodedDesignationFilter = encodeURIComponent(designationFilter);
      const response = await axios.get(
        `${BASE_URL}/search-resumes?skills=${encodedSkillsFilter}&designation=${encodedDesignationFilter}`,
        config
      );
      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }

  async deleteResume(resumeId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(resumeId);
      const response = await axios.delete(
        `${BASE_URL}/delete-resume?resumeId=${resumeId}`,
        config
      );
      return response.data;
    } catch (error) {
      //window.location = "/login";
      console.log("error : " + error);
    }
  }

  async addJob(job) {
    try {
      const response = await axios.post(`${BASE_URL}/add-job`, job, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }

  async getJobs() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/get-jobs`, config);
      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }
  async deleteJob(jobId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(jobId);
      const response = await axios.delete(
        `${BASE_URL}/delete-job?jobId=${jobId}`,
        config
      );
      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }

  async matchJobs(jobTitle) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const encodedJobTitle = encodeURIComponent(jobTitle);
      const response = await axios.get(
        `${BASE_URL}/match-resumes?jobTitle=${encodedJobTitle}`,
        config
      );
      return response.data;
    } catch (error) {
      window.location = "/login";
      console.log("error : " + error);
    }
  }
}

export default new RouteService();
