import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.BACKEND_URL || "http://localhost:5000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const http = new Http().instance;
export default http;
