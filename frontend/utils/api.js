import { create } from "apisauce";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://miniture-octo-lamp.onrender.com/api",
});

const api = create({
  axiosInstance: axiosInstance,
  baseURL: "https://miniture-octo-lamp.onrender.com/api"
});

export default api;
