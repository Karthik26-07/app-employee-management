import { HttpClient } from "../lib/network/http-client";

const CREATE_TASK = "task/create-task";
const UPDATE_TASK = "task/update";
const TASK_BY_TEAM = "task/task-by-team";
const UPDATE_STATUS = "task/update-task-status";
const DELETE_TASK = "task/delete-task";

const createTask = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(CREATE_TASK, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const updateTask = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_TASK, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}


const taskByTeam = (params) => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(TASK_BY_TEAM, params)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const updateTaskStatus = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_STATUS, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const deleteTask = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(DELETE_TASK, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
export const TaskApi = { createTask, taskByTeam, updateTask, updateTaskStatus, deleteTask }