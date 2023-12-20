import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import AuthService from "../../../routes/AuthService";

const Signup = () => {
  const [data, setData] = useState({
    companyName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.signup(data);
      if (response >= 400 && response <= 500) {
        setError("Invalid email, please try again");
      } else if (response >= 500) {
        setError("Please try later");
      } else if (response == 200) {
        navigate("/login");
        console.log(response);
      } else {
        navigate("/signup");
      }
    } catch (error) {
      setError("Please try again");
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1 className="title">Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="white_btn">
              Sign in
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="companyName"
              placeholder="Company Name"
              name="companyName"
              onChange={handleChange}
              value={data.companyName}
              required
              className="input"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="green_btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
