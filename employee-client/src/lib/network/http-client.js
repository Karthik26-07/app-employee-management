import { ApiResponse } from "../../Api/response/api-response";
import AxiosInstance from "./axios-config";

const Get = async (url, params = {}) => {
    return new Promise((resolve, reject) => {
        AxiosInstance.get(url, { params })
            .then((res) => {
                const response = new ApiResponse(res);
                if (response.isSuccess) return resolve(response)
                return reject(response);
            })
            .catch(e => reject(e))
    })
};

const Post = async (url, data = {}) => {
    return new Promise((resolve, reject) => {
        AxiosInstance.post(url, data)
            .then((res) => {
                const response = new ApiResponse(res);
                if (response.isSuccess) return resolve(response)
                return reject(response);
            })
            .catch(e => reject(e))
    })
};

export const HttpClient = { Get, Post }