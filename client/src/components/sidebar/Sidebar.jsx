import { useNavigate } from "react-router-dom";
import "./sidebar.scss";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from "@mui/icons-material/Work";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="top">
        <h3> Talent Manager </h3>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li onClick={() => navigate("/")}>
            <GridViewRoundedIcon />
            <span>
              Dashboard
            </span>
          </li>
          <p className="title">Applicant Mangement</p>
          <li onClick={() => navigate("/process-resumes")}>
            <ArticleIcon />
            <span>Process Resumes</span>
          </li>
          <li onClick={() => navigate("/view-applicants")}>
            <GroupIcon />
            <span>View Applicants</span>
          </li>
          <p className="title">Job Mangement</p>
          <li onClick={() => navigate("/view-jobs")}>
            <WorkIcon />
            <span>View Jobs</span>
          </li>
          <li onClick={() => navigate("/match-jobs")}>
            <AssessmentRoundedIcon />
            <span>Job Matching</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
