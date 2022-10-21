import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://localhost:3002",
});

export default ApiClient;
