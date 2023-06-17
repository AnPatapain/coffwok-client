import VerticalNav from "../components/VerticalNav.jsx";
import PlanCreationEditCard from "../components/PlanCreationEditCard.jsx";
import {useState} from "react";
import PlanService from "../api/services/plan.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";

const PlanCrud = () => {
    const navigate = useNavigate()
    const url = new URL(window.location.href);
    let isEdit = url.searchParams.get("isEdit") === 'true'

    const [planDTO, setPlanDTO] = useState({
        coffeeShop: "",
        schedule: ""
    })

    const [errorMessage, setErrorMessage] = useState("")

    const planInfo = {
        imgUrl: "https://res.cloudinary.com/du7mbtyzp/image/upload/w_350,h_250,c_fill,g_face,q_100/v1686820788/coffwok_dev/67a0b02f-40ab-46d4-bf38-b32b84b7fdef.jpg.jpg",
        name: "kean_3so",
        school: "INSA CVL",
        strength_subjects: ["physic", "coding", "math", "french"],
        weak_subjects: ["english", "chemistry", "english"]
    }

    const submitPlan = () => {
        if(planDTO.coffeeShop === "" || planDTO.schedule==="") {
            setErrorMessage("Please fill the form : )")
        }else {
            setErrorMessage("")
            console.log(planDTO)
            if(isEdit) {
                //TODO: patch request
                console.log('edit')
            }else {
                PlanService.uploadPlan(planDTO)
                    .then(response => {
                        console.log(response.data)
                        navigate("/dashboard")
                    })
                    .catch(error => {
                        const errMessage = getErrorMessage(error)
                        console.log(errMessage)
                        navigate("/dashboard")
                    })
            }
        }
    }

    return (
        <div className="plan-crud-container">
            <VerticalNav/>
            <h2>{isEdit ? "Edit":"Create"} Café-Study plan</h2>
            <PlanCreationEditCard planInfo={planInfo} planDTO={planDTO} setPlanDTO={setPlanDTO}/>
            {errorMessage ? <p className="error-msg">{errorMessage}</p>:""}
            <button className="primary-button" onClick={submitPlan}>Publish Plan</button>
        </div>
    )
}

export default PlanCrud