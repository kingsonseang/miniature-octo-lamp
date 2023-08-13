import { create } from "apisauce";
import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://192.168.89.217:8080/api",
// });

const axiosInstance = axios.create({
  baseURL: "https://miniture-octo-lamp.onrender.com/api",
});

const api = create({
  axiosInstance: axiosInstance,
  baseURL: undefined
});

export default api;
