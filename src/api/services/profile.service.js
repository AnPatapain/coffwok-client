import {API_BASE_URL} from "../constant/index.js";
import RequestService from "./request.service.js";

const uploadProfileInfo = (profileData) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/profiles", profileData)
}

const uploadProfileImage = (profileId, file) => {
    return RequestService.postRequestFile(API_BASE_URL + "/api/profiles/images/" + profileId, file)
}

const ProfileService = {
    uploadProfileInfo,
    uploadProfileImage
}

export default ProfileService