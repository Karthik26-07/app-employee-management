import axios from "axios";
import { BASE_API_URL, LS_ACCESS_TOKEN_KEY } from "../../config/env-helper";
import { ApiResponse } from "../../Api/response/api-response";
import { LOGIN_USER } from "../../Api/AuthApi";
import SecureStorageService from "../store/secure-store";
import { CONTENT_TYPE_FORM, CONTENT_TYPE_JSON, MULTIPART_URL } from "../../config/constants";

const AxiosInstance = axios.create({
    baseURL: BASE_API_URL, // Replace with your API's base URL
    timeout: 10000, // Set a timeout for requests (optional)
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = SecureStorageService.getItem(LS_ACCESS_TOKEN_KEY);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        const contentType = MULTIPART_URL.includes(config.url) ? CONTENT_TYPE_FORM : CONTENT_TYPE_JSON;

        config.headers['Content-Type'] = contentType;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosInstance.interceptors.response.use(
    async (res) => {
        const { url } = res.config;

        if (url == LOGIN_USER) {
            const accessToken = await res.data?.data.accessToken;
            if (accessToken) {
                SecureStorageService.setItem(LS_ACCESS_TOKEN_KEY, accessToken)
                delete res.data.data.accessToken;
            }
        }

        // You can modify the response data here
        const response = new ApiResponse(res.data);
        return response;
    },
    (error) => {

        let errorMessage = "";
        // Handle errors globally
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
            console.error('Status:', error.response.status);
            errorMessage = error.response.data;
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
            errorMessage = error.request;

        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            errorMessage = error.message;

        }
        return Promise.reject(errorMessage);
    }
);

export default AxiosInstance;


