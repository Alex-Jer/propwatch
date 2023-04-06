import axios from "axios";
import { env } from "~/env.mjs";

const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
