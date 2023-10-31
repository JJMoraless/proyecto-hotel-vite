import axios from "axios";
const token = localStorage.getItem("token")
console.log("🚀 ~ file: api.js:3 ~ token:", token)

export const hotelApi = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
