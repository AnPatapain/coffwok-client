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

import {GrMapLocation} from "react-icons/gr"
import ChatService from "../api/services/chat.service.js";
import ImageService from "../api/services/image.service.js";


const DashBoard = () => {
    const navigate = useNavigate()
    const [plans, setPlans] = useState([])
    const [myPlan, setMyPlan] = useState(null)

    const [notifyStomp, setNotifyStomp] = useState(null)
    const [notificationList, setNotificationList] = useState([])

    const [chatRooms, setChatRooms] = useState([])

    useEffect(() => {
        async function myFunc() {
            UserService.getCurrentUser()
                .then(async (data) => {
                    if (data) {
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
                                // const errMsg = getErrorMessage(error)
                                // console.log(errMsg)
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

                        await ChatService.getAllMyChatRooms()
                            .then(data => {
                                data = data.map(chatRoom => {
                                    const reformatChatRoom = {}
                                    reformatChatRoom["id"] = chatRoom.id
                                    reformatChatRoom["oppositeProfile"] = localStorage.getItem(PROFILE_ID) === chatRoom.profile1.id ? chatRoom.profile2 : chatRoom.profile1
                                    return reformatChatRoom
                                })
                                setChatRooms(data)
                            }).catch(error => console.log(error))
                    } else {
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
    }

    const handleClickAsideChatRoom = async (oppositeUserId, chatRoomId) => {
        const isInNotificationList = notificationList.some(notification => notification.chatRoomId === chatRoomId)
        if (isInNotificationList) {
            await NotificationService.removeNotificationForChatRoom(chatRoomId)
                .then(data => {
                    setNotificationList(data)
                    localStorage.setItem(SHOW_NOTIFICATION, data.length)
                }).catch(error => {
                    console.log(error)
                })
        }
        ChatService.handleNavigate(oppositeUserId, navigate)
    }

    const renderProfileItems = () => {
        return chatRooms.map((chatRoom) => (
            <li key={chatRoom.id} onClick={() => {
                handleClickAsideChatRoom(chatRoom.oppositeProfile.userId, chatRoom.id)
            }}>
                <img
                    src={ImageService.modifyImageURI(chatRoom.oppositeProfile.imgUrl, ["w_50", "h_50", "q_100", "c_thumb"])}/>
                <div>
                    <h2>{chatRoom.oppositeProfile.name}</h2>
                    {
                        notificationList.length > 0 && notificationList.some(
                            (notification) => notification.chatRoomId === chatRoom.id
                        ) ? <span>[new message]</span> : null
                    }
                </div>
            </li>
        ));
    };

    console.log(chatRooms)

    return (
        <div className="dashboard-page">
            <VerticalNav/>
            <div className="dashboard-container">
                <div className="newfeed-container">
                    <h2><GrMapLocation className="location-icon"/>Các kế hoạch café-học bài tại Quy Nhơn</h2>
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

                <aside>
                    <ul>
                        <h2>café - học bài soulmates</h2>
                        {renderProfileItems()}
                    </ul>
                </aside>
            </div>
        </div>
    )
}

export default DashBoard