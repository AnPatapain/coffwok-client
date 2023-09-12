import RequestService from "./request.service.js";
import {API_BASE_URL} from "../constant/index.js";
import {getErrorMessage} from "../error/errorMessage.js";

const uploadPlan = (planDTO) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/plans", planDTO)
}

const editPlan = (planId, planDTO) => {
    return RequestService.patchRequestJson(API_BASE_URL + "/api/plans/" + planId, planDTO)
}

const deletePlan = (planId) => {
    return RequestService.deleteRequest(API_BASE_URL + "/api/plans/" + planId)
}

const getPlanById = (planId) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/plans/" + planId)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const getMyPlan = () => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/plans/me")
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const getAllPlans = (page, pageSize) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + `/api/plans?page=${page}&size=${pageSize}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const PlanService = {
    uploadPlan,
    editPlan,
    deletePlan,
    getPlanById,
    getMyPlan,
    getAllPlans
}

export default PlanService