import { create } from "apisauce";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.167.217:8080/api",
});

const api = create({
  axiosInstance: axiosInstance,
  baseURL: undefined
});

export default api;
