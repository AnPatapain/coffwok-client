import {useEffect, useRef, useState} from "react";
import ChatService from "../api/services/chat.service.js";
import {PROFILE_ID, SHOW_NOTIFICATION, USER_ID} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";
import {useNavigate, useParams} from "react-router-dom";
import VerticalNav from "../components/VerticalNav.jsx";
import NotificationService from "../api/services/notification.service.js";

const Chat = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [stompClient, setStompClient] = useState(null)

    const [currentChatRoom, setCurrentChatRoom] = useState({
        id: "",
        oppositeProfile: null,
        messages: []
    })
    const [chatRooms, setChatRooms] = useState([])
    const [text, setText] = useState("")
    const [messageList, setMessageList] = useState([])
    const container = useRef(null)
    const [notificationList, setNotificationList] = useState([])

    let mobileActive = false


    useEffect(() => {
        async function fetchData() {
            if (id) {
                await ChatService.getChatRoomById(id)
                    .then(data => {
                        setCurrentChatRoom(prevState => ({
                            ...prevState,
                            id: data.id,
                            oppositeProfile: localStorage.getItem(PROFILE_ID) === data.profile1.id ? data.profile2:data.profile1,
                            messages: data.messages
                        }))
                        let stompClient_ = ChatService.connect_socket(id, onReceiveMessage)
                        setStompClient(stompClient_)
                    }).catch(error => console.log(error))
            }
            await ChatService.getAllMyChatRooms()
                .then(data => {

                    data = data.map(chatRoom => {
                        const reformatChatRoom = {}
                        reformatChatRoom["id"] = chatRoom.id
                        reformatChatRoom["oppositeProfile"] = localStorage.getItem(PROFILE_ID) === chatRoom.profile1.id ? chatRoom.profile2:chatRoom.profile1
                        return reformatChatRoom
                    })
                    setChatRooms(data)
                }).catch(error => console.log(error))

            await NotificationService.getNotifications(localStorage.getItem(USER_ID))
                .then(data => {
                    setNotificationList(data)
                }).catch(error => {
                    console.log(error)
                })

            NotificationService.connect_notification_endpoint(localStorage.getItem(USER_ID), onReceiveNotification)

        }

        fetchData()
    }, [id])

    const handleChangeText = (e) => {
        let value = e.target.value
        setText(value)
    }

    const handleSubmit = (e) => {
        if (text !== "") {
            e.preventDefault()
            let message = {
                messageType: "TEXT",
                localDateTime: new Date(),
                text: text,
                senderId: localStorage.getItem(USER_ID)
            }
            if (stompClient !== null) {
                ChatService.sendMessageRealTime(stompClient, currentChatRoom.id, JSON.stringify(message))
                setText("")
            }
        }
    }

    const onReceiveMessage = (messageJson) => {
        const newMessage = JSON.parse(messageJson.body)
        const isDuplicate = messageList.find(message => message.id === newMessage.id)
        if (!isDuplicate) {
            messageList.push(newMessage)
            setMessageList([...messageList])
        }
    }

    const onReceiveNotification = (messageJson) => {
        const newNotification = JSON.parse(messageJson.body)
        setNotificationList(newNotification)
        localStorage.setItem(SHOW_NOTIFICATION, newNotification.length)
    }

    // For scroll message
    const Scroll = () => {
        const {offsetHeight, scrollHeight, scrollTop} = container.current
        if (scrollHeight <= scrollTop + offsetHeight + 18000) {
            container.current?.scrollTo(0, scrollHeight)
        }
    }

    useEffect(() => {
        if (messageList.length !== 0 || currentChatRoom.messages.length !== 0) {
            Scroll()
        }
    }, [messageList, currentChatRoom])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleClickAsideChatRoom = async (oppositeUserId, chatRoomId) => {
        const isInNotificationList = notificationList.some(notification => notification.chatRoomId === chatRoomId)
        if(isInNotificationList) {
            await NotificationService.removeNotificationForChatRoom(chatRoomId)
                .then(data => {
                    setNotificationList(data)
                    localStorage.setItem(SHOW_NOTIFICATION, data.length)
                }).catch(error => {console.log(error)})
        }
        ChatService.handleNavigate(oppositeUserId, navigate)
    }

    const renderProfileItems = () => {
        let filteredChatRooms = chatRooms
        if (currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null) {
            filteredChatRooms = chatRooms.filter(
                (chatRoom) => currentChatRoom.oppositeProfile.id !== chatRoom.oppositeProfile.id
            );
        }
        return filteredChatRooms.map((chatRoom) => (
            <li key={chatRoom.id} onClick={() => {
                handleClickAsideChatRoom(chatRoom.oppositeProfile.userId, chatRoom.id)
            }}>
                <img src={ImageService.modifyImageURI(chatRoom.oppositeProfile.imgUrl, ["w_60", "h_60", "q_100", "c_thumb"])}/>
                <div>
                    <h2>{chatRoom.oppositeProfile.name}</h2>
                    {
                        notificationList.length > 0 && notificationList.some(
                            (notification) => notification.chatRoomId === chatRoom.id
                        ) ? "[new message]":null
                    }
                </div>
            </li>
        ));
    };

    return (
        <div className="chat-page">
            <VerticalNav selectedItem={"message"}/>
            <div className="chat-container">
                <aside className={currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null ? "hide-aside":""}>
                    <ul>
                        <h2>Tin nhắn</h2>
                        {currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null ?
                            <li className="selected">
                                <img
                                    src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_50", "h_50", "q_100", "c_thumb"])}/>
                                <div>
                                    <h2>{currentChatRoom.oppositeProfile.name}</h2>
                                </div>
                            </li> : null
                        }
                        {renderProfileItems()}
                    </ul>
                </aside>
                <main className={currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null ? "show-main":""}>
                    {currentChatRoom.id === "" || currentChatRoom.oppositeProfile == null ?
                        <h1 className="primary-title">Chat</h1> :
                        <div className="current-chat-room-container">
                            <header>
                                <img
                                    src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_50", "h_50", "q_100", "c_thumb"])}
                                    onClick={() => {navigate("/profile/" + currentChatRoom.oppositeProfile.id)} }
                                />
                                <p onClick={() => {
                                    navigate("/profile/" + currentChatRoom.oppositeProfile.id)
                                }}>{currentChatRoom.oppositeProfile.name}</p>
                            </header>
                            <ul className="show-message-container" ref={container}>
                                {currentChatRoom.messages.map(message => {
                                    return (
                                        <li className={message.senderId === localStorage.getItem(USER_ID) ? "me" : "you"}
                                            key={message.id}>
                                            {message.senderId === currentChatRoom.oppositeProfile.userId ?
                                                <img className="message-img" src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_40", "h_40", "q_100", "c_thumb"])}/>
                                                :null
                                            }
                                            <div className="message">
                                                {message.text}
                                            </div>
                                        </li>
                                    )
                                })}

                                {messageList.length !== 0 ? messageList.map(message => {
                                    return (
                                        <li className={message.senderId === localStorage.getItem(USER_ID) ? "me" : "you"}
                                            key={message.id}>
                                            {message.senderId === currentChatRoom.oppositeProfile.userId ?
                                                <img className="message-img" src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_40", "h_40", "q_100", "c_thumb"])}/>
                                                :null
                                            }
                                            <div className="message">
                                                {message.text}
                                            </div>
                                        </li>
                                    )
                                }) : null}
                            </ul>
                            <footer>
                                <form onSubmit={handleSubmit}>
                                    <textarea placeholder="Type your message"
                                              name="text"
                                              value={text}
                                              onChange={handleChangeText}
                                              onKeyDown={handleKeyDown}
                                              onClick={() => {setMobileActive(true)}}
                                    >
                                    </textarea>
                                    <a href="#" onClick={handleSubmit}>Gửi</a>
                                </form>
                            </footer>
                        </div>
                    }
                </main>
            </div>
        </div>
    )
}

export default Chat