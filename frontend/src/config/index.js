import axios from "axios";

export const base_url = "https://toconnect-backend.onrender.com"

export const clientServer = axios.create({
    baseURL: base_url,
    withCredentials: true,
})