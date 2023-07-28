import { create } from "apisauce";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.101:8080/api",
});

const api = create({ axiosInstance: axiosInstance });

export default api;
