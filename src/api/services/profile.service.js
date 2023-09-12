import {API_BASE_URL} from "../constant/index.js";
import RequestService from "./request.service.js";
import {getErrorMessage} from "../error/errorMessage.js";

const getAllProfiles =  (page, pageSize) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + `/api/profiles?page=${page}&size=${pageSize}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const uploadProfileInfo = (profileData) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/profiles", profileData)
}

const uploadProfileImage = (profileId, file) => {
    return RequestService.postRequestFile(API_BASE_URL + "/api/profiles/images/" + profileId, file)
}

const editProfileInfo = (profileId, updatedProfileData) => {
    return RequestService.patchRequestJson(API_BASE_URL + `/api/profiles/${profileId}`, updatedProfileData)
}

const getProfileById = (id) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/profiles/" + id)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const getMyProfile = () => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/profiles/me")
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                const errMsg = getErrorMessage(error)
                reject(errMsg)
            })
    })
}

const ProfileService = {
    uploadProfileInfo,
    uploadProfileImage,
    editProfileInfo,
    getMyProfile,
    getProfileById,
    getAllProfiles
}

export default ProfileService