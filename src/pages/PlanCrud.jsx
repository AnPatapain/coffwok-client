import VerticalNav from "../components/VerticalNav.jsx";
import PlanCreationEditCard from "../components/PlanCreationEditCard.jsx";
import {useEffect, useState} from "react";
import PlanService from "../api/services/plan.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import ImageService from "../api/services/image.service.js";
import {PROFILE_IMG} from "../api/constant/index.js";
import UserService from "../api/services/user.service.js";
import ProfileService from "../api/services/profile.service.js";

const PlanCrud = () => {
    const navigate = useNavigate()

    const [planDTO, setPlanDTO] = useState({
        coffeeShop: "",
        schedule: "",
        planDetails: ""
    })

    const [errorMessage, setErrorMessage] = useState("")

    const [planInfo, setPlanInfo] = useState({
        imgUrl: localStorage.getItem(PROFILE_IMG) ? ImageService.modifyImageURI(localStorage.getItem(PROFILE_IMG), ["w_50", "h_50", "c_fill", "g_face", "q_100"]) : "",
        name: "",
        school: ""
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
                                school: data.school
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
                                schedule: data.schedule,
                                planDetails: data.planDetails
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
            setErrorMessage("Xin bạn điền thông tin ^^")
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
            <VerticalNav selectedItem={"plan"}/>
            <h2>{oldPlan ? "Thay đổi" : "Tạo"} Kế hoạch cà phê học bài</h2>
            <PlanCreationEditCard planInfo={planInfo} planDTO={planDTO} setPlanDTO={setPlanDTO} oldPlan={oldPlan}/>
            {errorMessage ? <p className="error-msg">{errorMessage}</p> : ""}

            {
                oldPlan ?
                    <div className="button-group">
                        <button className="primary-button" onClick={editPlan}>Lưu</button>
                        <button className="primary-button" onClick={deletePlan}>Xóa</button>
                    </div>:
                    <button className="primary-button" onClick={submitPlan}>Đăng Kế Hoạch</button>
            }
        </div>
    )
}

export default PlanCrud