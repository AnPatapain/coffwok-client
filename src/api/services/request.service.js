import {ACCESS_TOKEN} from "../constant/index.js";
import axios from "axios";

const request = (req) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
    }

    return axios.get(req, {headers: headers}).then(response => {
        if(response.status === 200) {
            return response.data
        }
        return Promise.reject(response.data)
    })
};
const RequestService = {
    request
}
export default RequestService

