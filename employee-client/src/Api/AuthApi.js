import { HttpClient } from "../lib/network/http-client";


export const LOGIN_USER = "auth/login"

const login = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(LOGIN_USER, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

export const AuthApi = { login }