import VerticalNav from "../components/VerticalNav.jsx";
import PlanCreationEditCard from "../components/PlanCreationEditCard.jsx";
import {useEffect, useState} from "react";
import PlanService from "../api/services/plan.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import ImageService from "../api/services/image.service.js";
import {ACCESS_TOKEN, PROFILE_IMG} from "../api/constant/index.js";
import UserService from "../api/services/user.service.js";
import ProfileService from "../api/services/profile.service.js";

const PlanCrud = () => {
    const navigate = useNavigate()

    const [planDTO, setPlanDTO] = useState({
        coffeeShop: "",
        schedule: ""
    })

    const [errorMessage, setErrorMessage] = useState("")

    const [planInfo, setPlanInfo] = useState({
        imgUrl: localStorage.getItem(PROFILE_IMG) ? ImageService.modifyImageURI(localStorage.getItem(PROFILE_IMG), ["w_50", "h_50", "c_fill", "g_face", "q_100"]) : "",
        name: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    const [oldPlan, setOldPlan] = useState(null)

    useEffect(() => {
        UserService.getCurrentUser()
            .then(user => {
                if (user.profileId) {
                    ProfileService.getMyProfile()
                        .then(data => {
                            setPlanInfo(prevState => ({
                                ...prevState,
                                imgUrl: ImageService.modifyImageURI(data.imgUrl, ["w_50", "h_50", "c_fill", "g_face", "q_100"]),
                                name: data.name,
                                school: data.school,
                                strength_subjects: data.strength_subjects,
                                weak_subjects: data.weak_subjects
                            }))
                        })
                }else {
                    localStorage.clear()
                    navigate("/")
                }
                if (user.planId) {
                    PlanService.getPlanById(user.planId)
                        .then(data => {
                            setOldPlan(data)
                            setPlanDTO(prevState => ({
                                ...prevState,
                                coffeeShop: data.coffeeShop,
                                schedule: data.schedule
                            }))
                        })
                        .catch(error => {
                            console.log(error)
                            navigate("/dashboard")
                        })
                }
            })
            .catch(error => {
                localStorage.clear()
                navigate("/")
            })
    }, [])

    const submitPlan = () => {
        if (planDTO.coffeeShop === "" || planDTO.schedule === "") {
            setErrorMessage("Please fill the form : )")
        } else {
            setErrorMessage("")
            PlanService.uploadPlan(planDTO)
                .then(response => {
                    console.log("response data after submit", response.data)
                    navigate("/dashboard")
                })
                .catch(error => {
                    const errMessage = getErrorMessage(error)
                    console.log(errMessage)
                    navigate("/dashboard")
                })
        }
    }

    const editPlan = () => {
        return PlanService.editPlan(oldPlan.id, planDTO)
            .then(response => {
                console.log("response data after edit", response.data)
                navigate("/dashboard")
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                navigate("/dashboard")
            })
    }

    const deletePlan = () => {
        //TODO: delete request
        return PlanService.deletePlan(oldPlan.id)
            .then(response => {
                console.log("response data after delete", response.data)
                navigate("/dashboard")
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                navigate("/dashboard")
            })
    }
    return (
        <div className="plan-crud-container">
            <VerticalNav/>
            <h2>{oldPlan ? "You already had" : "Create"} Café-Study plan</h2>
            <PlanCreationEditCard planInfo={planInfo} planDTO={planDTO} setPlanDTO={setPlanDTO} oldPlan={oldPlan}/>
            {errorMessage ? <p className="error-msg">{errorMessage}</p> : ""}

            {
                oldPlan ?
                    <div className="button-group">
                        <button className="primary-button" onClick={editPlan}>Save</button>
                        <button className="primary-button" onClick={deletePlan}>Delete</button>
                    </div>:
                    <button className="primary-button" onClick={submitPlan}>Publish Plan</button>
            }
        </div>
    )
}

export default PlanCrud