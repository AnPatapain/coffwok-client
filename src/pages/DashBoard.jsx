import VerticalNav from "../components/VerticalNav.jsx";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {useNavigate} from "react-router-dom";
import localStorageService from "../api/services/localStorage.service.js";
import {PROFILE_ID, PROFILE_IMG, SHOW_NOTIFICATION, USER_ID} from "../api/constant/index.js";
import PlanService from "../api/services/plan.service.js";
import PlanCard from "../components/PlanCard.jsx";
import UserService from "../api/services/user.service.js";
import NotificationService from "../api/services/notification.service.js";


const DashBoard = () => {
    const navigate = useNavigate()
    const [plans, setPlans] = useState([])
    const [myPlan, setMyPlan] = useState(null)

    const [notifyStomp, setNotifyStomp] = useState(null)
    const [notificationList, setNotificationList] = useState([])

    useEffect(() => {
        async function myFunc() {
            UserService.getCurrentUser()
                .then(async (data) => {
                    if(data) {
                        localStorage.setItem(SHOW_NOTIFICATION, data.notificationList.length)
                        setNotificationList(data.notificationList)
                        await ProfileService.getMyProfile()
                            .then(data => {
                                if (data.imgUrl === null) {
                                    navigate("/profile-image-creation")
                                } else {
                                    localStorageService.add(PROFILE_ID, data.id)
                                    localStorageService.add(USER_ID, data.userId)
                                    localStorageService.add(PROFILE_IMG, data.imgUrl)
                                    let notifyStomp_ = NotificationService.connect_notification_endpoint(data.userId, onReceiveNotification)
                                    setNotifyStomp(notifyStomp_)
                                }
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
                                console.log(getErrorMessage(error))
                            })

                        await PlanService.getMyPlan()
                            .then(data => {
                                setMyPlan(data)
                            })
                            .catch(error => {
                                console.log(getErrorMessage(error))
                            })
                    }else {
                        localStorage.clear()
                        navigate("/")
                    }

                })
                .catch(error => {
                    localStorage.clear()
                    navigate("/")
                })

        }

        myFunc()
    }, [])

    const onReceiveNotification = (messageJson) => {
        const newNotificationList = JSON.parse(messageJson.body)
        localStorage.setItem(SHOW_NOTIFICATION, newNotificationList.length)
        setNotificationList(newNotificationList)
        console.log(newNotificationList)
    }

    return (
        <div className="dashboard-container">
            <VerticalNav/>
            <div className="plans-container">
                {plans.map(plan => {
                    if (myPlan && plan.id === myPlan.id) {
                        return <PlanCard key={plan.id} planInfo={plan} isOwner={true}/>
                    } else {
                        return <PlanCard key={plan.id} planInfo={plan}/>
                    }
                })}
            </div>
        </div>
    )
}

export default DashBoard