import VerticalNav from "../components/VerticalNav.jsx";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {useNavigate} from "react-router-dom";
import localStorageService from "../api/services/localStorage.service.js";
import {PROFILE_ID, PROFILE_IMG, SHOW_NOTIFICATION, USER_ID} from "../api/constant/index.js";
import UserService from "../api/services/user.service.js";
import NotificationService from "../api/services/notification.service.js";

import ChatService from "../api/services/chat.service.js";
import ImageService from "../api/services/image.service.js";
import HorizontalNav from "../components/HorizontalNav.jsx";
import ProfileCard from "../components/ProfileCard.jsx";


const DashBoard = () => {
    const navigate = useNavigate()

    const [profiles, setProfiles] = useState([])
    const [myProfile, setMyProfile] = useState(null)
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(50)
    const [isFetching, setIsFetching] = useState(false)

    const [notificationList, setNotificationList] = useState([])
    const [chatRooms, setChatRooms] = useState([])

    const handleScroll = () => {
        if(Math.ceil(window.innerHeight + document.documentElement.scrollTop) >=
            document.documentElement.offsetHeight && !isFetching) {
            setPage(prevState => prevState + 1)
            setIsFetching(true)
        }
    };

    const fetchProfiles = async () => {
        await ProfileService.getAllProfiles(page, pageSize)
            .then(data => {
                if(data._embedded) {
                    setProfiles(prevProfiles => {
                        const newProfiles = data._embedded.profileList.filter(newProfile => {
                            return !prevProfiles.some(prevProfile => prevProfile.id === newProfile.id);
                        });
                        return [...prevProfiles, ...newProfiles];
                    })
                }
            })
            .catch(error => {
                console.log(getErrorMessage(error))
            })
    }

    const fetchMoreProfiles = async () => {
        await fetchProfiles()
        setIsFetching(false)
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        if (isFetching) {
            fetchMoreProfiles()
        }
    }, [isFetching])

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
                                    NotificationService.connect_notification_endpoint(data.userId, onReceiveNotification)
                                }
                            })
                            .catch(error => {
                                navigate("/")
                            })


                        await fetchProfiles()

                        await ProfileService.getMyProfile()
                            .then(data => {
                                setMyProfile(data)
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

    return (
        <div className="dashboard-page">
            <VerticalNav selectedItem={"dashboard"}/>
            <HorizontalNav/>
            <div className="dashboard-container">
                <div className="newfeed-container">
                    <div className="plans-container">
                        {profiles.map(profile => {
                            if (myProfile && profile.id === myProfile.id) {
                                return <ProfileCard key={profile.id} profile={profile} isOwner={true} isShowButton={true}/>
                            } else {
                                return <ProfileCard key={profile.id} profile={profile} isOwner={false} isShowButton={true}/>
                            }
                        })}
                        {isFetching ? <h4>Đang tải ...</h4>:null}
                    </div>
                </div>

                <aside>
                    <ul>
                        <h2 className="soulmates-title">café - học bài soulmates</h2>
                        {renderProfileItems()}
                    </ul>
                </aside>
            </div>
        </div>
    )
}

export default DashBoard