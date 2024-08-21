import { HttpClient } from "../lib/network/http-client";

const GET_LEAVES = "leave/leaves"
const UPDATE_LEAVES = "leave/update"
const APPLY_LEAVE = "leave/apply-leave"
const GET_APPLY_LEAVE = "leave/applied-leaves"
const CANCEL_LEAVE = "leave/cancel-leave"
const ADMIN_LEAVE_APPLICATIONS = "leave/leave-applications";
const HANDLE_LEAVE_APPLICATION = "leave/handle-leave-application";

const getLeaves = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_LEAVES)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const updateLeave = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_LEAVES, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const applyLeave = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(APPLY_LEAVE, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const cancelLeave = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(CANCEL_LEAVE, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const getAppliedLeave = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_APPLY_LEAVE)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const adminLeaverApplication = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(ADMIN_LEAVE_APPLICATIONS)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const handleLeaveApplication = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(HANDLE_LEAVE_APPLICATION, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
export const LeaveApi = {
    getLeaves, updateLeave, applyLeave, getAppliedLeave, cancelLeave, adminLeaverApplication, handleLeaveApplication
}