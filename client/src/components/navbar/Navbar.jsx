import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="title">Talent Recruiter Dashboard</div>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location = "/login";
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
