import axios from "axios";

export const base_url = "http://localhost:3000"

export const clientServer = axios.create({
    baseURL: base_url,
    withCredentials: true,
})