import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

class AuthService {

  async signup(data){
    try {
        const response = await axios.post(`${BASE_URL}/signup`, data);
        return response.status;
      } catch (error) {
        const errorStatus = error.response.status;
        return errorStatus
      }
  }
  async login(data){
    try {
        const response = await axios.post(`${BASE_URL}/login`, data);
        localStorage.setItem("token", response.data.token);
        return response.status;
      } catch (error) {
        const errorStatus = error.response.status;
        return errorStatus
      }
  }
  
}

export default new AuthService();