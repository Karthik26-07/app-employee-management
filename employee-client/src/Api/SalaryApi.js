import { HttpClient } from "../lib/network/http-client";

const GET_SALARY = 'salary/salary';
const UPDATE_SALARY = 'salary/update';

const getSalary = () => {
    return new Promise((resolve, reject) => {
        HttpClient.Get(GET_SALARY)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

const updateSalary = (data) => {
    return new Promise((resolve, reject) => {
        HttpClient.Post(UPDATE_SALARY, data)
            .then((res) => resolve(res))
            .catch((e) => reject(new Error(e)));
    })
}

export const SalaryApi = { getSalary, updateSalary }