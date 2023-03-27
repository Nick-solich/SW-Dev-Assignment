import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth/register";

//Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    console.log(JSON.stringify(response.data));
    console.log(response.data.name);
    if (response.data) {
      //localStorage.setItem('user',JSON.stringify(response.data))
      localStorage.setItem("user", response.data.name);
    }
    return response.data.name; //response.data
  } catch (error) {
    console.log("authService: register");
    console.log(error);
  }
};

const authService = {
  register,
};

export default authService;
