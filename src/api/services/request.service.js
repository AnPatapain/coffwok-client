import {ACCESS_TOKEN} from "../constant/index.js";
import axios from "axios";

const getRequest = (req) => {
    const headers = {
        'Content-Type': 'application/json'
    }

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
    }

    return axios.get(req, {headers: headers})
};

const postRequestJson = (req, data) => {
    const headers = {
        'Content-Type': 'application/json'
    }

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
    }

    return axios.post(req, data, {headers: headers})
}

const patchRequestJson = (req, data) => {
    const headers = {
        'Content-Type': 'application/json'
    }
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
    }

    return axios.patch(req, data, {headers: headers})
}

const postRequestFile = (req, file) => {
    const headers = {
        'Content-Type': 'multipart/form-data'
    }

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
    }

    let formData = new FormData()
    formData.append("file", file)

    return axios.post(req, formData, {headers: headers})
}

const RequestService = {
    getRequest,
    postRequestJson,
    patchRequestJson,
    postRequestFile
}
export default RequestService

