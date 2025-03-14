import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8090/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default http;
