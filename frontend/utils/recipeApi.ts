import { create } from "apisauce";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.spoonacular.com/recipes/",
});


const recipeApi = create({
  axiosInstance: axiosInstance,
  baseURL: undefined,
});

export default recipeApi;
