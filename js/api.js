import axios from "axios";

export const hotelApi = axios.create({
    baseURL: "http://localhost:8888"
})
