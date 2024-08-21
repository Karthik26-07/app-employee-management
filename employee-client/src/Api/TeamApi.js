import { HttpClient } from "../lib/network/http-client";

const GET_USER = "team/users";
const CREATE_TEAM = "team/create-team";
const GET_TEAMS = "team/teams";
const TEAM_BY_LEAD = "team/team-by-lead";
const TEAM_BY_MEMBERS = "team/team-by-member";
const TEAM_MEMBERS = "team/team-members";
const DELETE_TEAM = "team/delete-team";

const getUsers = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_USER)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const createTeam = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(CREATE_TEAM, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const getTeams = (params = { team_id: null }) => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_TEAMS, params)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const getTeamsByLead = (params = { role: "User" }) => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(TEAM_BY_LEAD, params)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const getTeamsByMember = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(TEAM_BY_MEMBERS)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}
const getTeamMembers = (params) => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(TEAM_MEMBERS, params)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const deleteTeam = (formData) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(DELETE_TEAM, formData)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

export const TeamApi = { getUsers, createTeam, getTeams, getTeamsByLead, getTeamMembers, getTeamsByMember, deleteTeam }