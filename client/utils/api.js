import { create } from "apisauce";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.197.217:8080/",
});

const api = create({ axiosInstance: axiosInstance });

export default api;
