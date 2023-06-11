import {API_BASE_URL} from "../constant/index.js";
import RequestService from "./request.service.js";
import {getErrorMessage} from "../error/errorMessage.js";

const uploadProfileInfo = (profileData) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/profiles", profileData)
}

const uploadProfileImage = (profileId, file) => {
    return RequestService.postRequestFile(API_BASE_URL + "/api/profiles/images/" + profileId, file)
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
    getMyProfile
}

export default ProfileService