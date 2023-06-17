import RequestService from "./request.service.js";
import {API_BASE_URL} from "../constant/index.js";

const uploadPlan = (planDTO) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/plans", planDTO)
}

const PlanService = {
    uploadPlan
}

export default PlanService