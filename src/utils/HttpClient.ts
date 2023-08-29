import axios from "axios";

const HttpClient = axios.create({
  baseURL: "/api",
});

export default HttpClient;
