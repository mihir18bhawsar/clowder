import axios from "axios";
import Cookies from "js-cookie";

const social = axios.create({
	baseURL: "http://127.0.0.1:8000/api",
});
social.interceptors.request.use((config) => {
	const token = Cookies.get("token");
	if (!token) {
		config.headers.Authorization = "";
	} else config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default social;
