import { UPDATE_PROFILE } from "../Api/UserApi";

export const ROLES = [
    {
        key: 'TEAM_LEAD',
        value: 'Team Lead'
    },
    {
        key: 'EMPLOYEE',
        value: 'Employee'
    },
];

export const LEAVE_TYPES = ["Casual Leave", "Sick Leave"]
export const STATUS = ['Accept', 'Reject']
export const TASK_STATUS = ['Not Started', 'In Progress', 'Pending Review', 'Rejected', 'Completed']

export const CONTENT_TYPE_JSON = 'application/json';
export const CONTENT_TYPE_FORM = 'multipart/form-data';

export const MULTIPART_URL = [
    UPDATE_PROFILE
];

export const statusColors = {
    'Not Started': 'blue-gray',
    'In Progress': 'blue',
    'Pending Review': 'orange',
    'Rejected': 'red',
    'Completed': 'green',
    'Approved': 'green',
};