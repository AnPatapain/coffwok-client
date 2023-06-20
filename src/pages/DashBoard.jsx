import VerticalNav from "../components/VerticalNav.jsx";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {useNavigate} from "react-router-dom";
import localStorageService from "../api/services/localStorage.service.js";
import {PROFILE_ID, PROFILE_IMG, USER_ID} from "../api/constant/index.js";
import PlanService from "../api/services/plan.service.js";
import PlanCard from "../components/PlanCard.jsx";

const DashBoard = () => {
    const navigate = useNavigate()
    const [plans, setPlans] = useState([])

    useEffect(() => {
        async function myFunc() {
            await ProfileService.getMyProfile()
                .then(data => {
                    localStorageService.add(PROFILE_ID, data.id)
                    localStorageService.add(USER_ID, data.userId)
                    localStorageService.add(PROFILE_IMG, data.imgUrl)
                })
                .catch(error => {
                    const errMsg = getErrorMessage(error)
                    console.log(errMsg)
                    navigate("/")
                })

            await PlanService.getAllPlans()
                .then(data => {
                    setPlans(data._embedded.planList)
                })
                .catch(error => {
                    console.log(error)
                })
        }
        myFunc()
    }, [])

    console.log("plans", plans)
    return (
        <div className="dashboard-container">
            <VerticalNav />
            <div className="plans-container">
                {plans.map(plan => {
                    return <PlanCard key={plan.id} planInfo={plan}/>
                })}
            </div>
        </div>
    )
}

export default DashBoard