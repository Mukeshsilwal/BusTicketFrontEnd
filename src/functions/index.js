import axios from "axios";
const singUp="https://busticketingsystem-1.onrender.com/";
const axiosInstance = axios.create({
  baseURL: singUp,
});

export default axiosInstance;
