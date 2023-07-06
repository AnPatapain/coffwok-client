import VerticalNav from "../components/VerticalNav.jsx";
import ImageService from "../api/services/image.service.js";
import NotificationService from "../api/services/notification.service.js";
import {PROFILE_ID,SHOW_NOTIFICATION} from "../api/constant/index.js";
import ChatService from "../api/services/chat.service.js";
import {useEffect, useState} from "react";
import UserService from "../api/services/user.service.js";
import {useNavigate} from "react-router-dom";

const ChatList = () => {
    const [chatRooms, setChatRooms] = useState([])
    const navigate = useNavigate()
    const [notificationList, setNotificationList] = useState([])

    useEffect(() => {
        async function fetchChat() {
            UserService.getCurrentUser()
                .then(async (data) => {
                    if (data) {
                        localStorage.setItem(SHOW_NOTIFICATION, data.notificationList.length)
                        setNotificationList(data.notificationList)
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
        fetchChat()
    }, [])

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
        <div className="chat-list-page">
            <VerticalNav/>
            <div className="chat-list-container">
                <aside>
                    <ul>
                        <h2>Café-Học bài soulmates</h2>
                        {renderProfileItems()}
                    </ul>
                </aside>
                <main>
                    <h1 className="primary-title">Chat</h1>
                </main>
            </div>
        </div>
    )
}

export default ChatList