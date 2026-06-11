import { create } from "axios";

export const api = create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
