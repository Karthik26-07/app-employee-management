import { HttpClient } from "../lib/network/http-client"

const CREATE_USER = "user/register";
const GET_USERS = "user/users";
const GET_USER = "user/user";
const UPDATE_USER = "user/update";
export const UPDATE_PROFILE = "user/update-profile";

const createUser = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(CREATE_USER, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const updateUser = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_USER, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const getUsers = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_USERS)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const getUser = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_USER)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const updateProfile = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_PROFILE, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

export const UserApi = {
    createUser, getUsers, updateUser, getUser, updateProfile
}