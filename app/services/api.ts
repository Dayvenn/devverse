import { create } from "axios";

export const api = create({
  baseURL: "http://192.168.15.7:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
