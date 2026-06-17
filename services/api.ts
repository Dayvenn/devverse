import axios from "axios";

export const api = axios.create({
 baseURL: "https://devverse-1-cyfw.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
