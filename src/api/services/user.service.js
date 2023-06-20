import {ACCESS_TOKEN, API_BASE_URL} from "../constant/index.js";
import RequestService from "./request.service.js";
import {getErrorMessage} from "../error/errorMessage.js";
const getCurrentUser = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if(!accessToken) {
        return new Promise((resolve, reject) => {
            reject("user is null")
        })
    }

    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/user/me")
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                const resMessage = getErrorMessage(error)
                reject(resMessage)
            })
    })
}

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/user/" + id)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const UserService = {
    getCurrentUser,
    getUserById
}

export default UserService