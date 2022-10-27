import axios from "axios";

const ApiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3002"
      : `${window.location}`,
});

export default ApiClient;
