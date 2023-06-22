import {useEffect, useState} from "react";
import ChatService from "../api/services/chat.service.js";
import {USER_ID} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";
import {useNavigate, useParams} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import VerticalNav from "../components/VerticalNav.jsx";

const Chat = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [stompClient, setStompClient] = useState(null)

    const [currentChatRoom, setCurrentChatRoom] = useState({
        id: "",
        userId1: "",
        userId2: "",
        messages: [],
        oppositeProfile: null
    })
    const [profileList, setProfileList] = useState([])
    const [text, setText] = useState("")
    const [messageList, setMessageList] = useState([])

    useEffect(() => {
        async function fetchData() {
            if (id) {
                await ChatService.getChatRoomById(id)
                    .then(data => {
                        setCurrentChatRoom(prevState => ({
                            ...prevState,
                            id: data.id,
                            userId1: data.userId1,
                            userId2: data.userId2,
                            messages: data.messages
                        }))
                        let stompClient_ = ChatService.connect_socket(id, onReceiveMessage)
                        setStompClient(stompClient_)
                    }).catch(error => console.log(error))
            }
            await ChatService.getAllProfilesOfChatRooms()
                .then(data => {
                    data = data.filter(value => value !== null)
                    setProfileList(data)
                }).catch(error => console.log(error))

        }

        fetchData()
    }, [id])

    useEffect(() => {
        if (currentChatRoom !== null && profileList !== null) {
            let oppositeUserId = localStorage.getItem(USER_ID) === currentChatRoom.userId1 ? currentChatRoom.userId2 : currentChatRoom.userId1

            profileList.forEach(profile => {
                if (profile.userId === oppositeUserId) {
                    setCurrentChatRoom(prevState => ({
                        ...prevState,
                        oppositeProfile: profile
                    }))
                }
            })
        }
    }, [profileList])

    const renderProfileItems = () => {
        let filteredProfileList = profileList
        if (currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null) {
            filteredProfileList = profileList.filter(
                (profile) => profile.userId !== currentChatRoom.oppositeProfile.userId
            );
        }
        return filteredProfileList.map((profile) => (
            <li key={profile.userId} onClick={() => {
                ChatService.handleNavigate(profile.userId, navigate)
            }}>
                <img src={ImageService.modifyImageURI(profile.imgUrl, ["w_50", "h_50", "q_100", "c_thumb"])}/>
                <div>
                    <h2>{profile.name}</h2>
                </div>
            </li>
        ));
    };

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
            // ChatService.sendMessage(currentChatRoom.id, message)
            //     .then(response => {
            //         console.log("updated chat_room", response.data)
            //         setText("")
            //     }).catch(error => console.log(getErrorMessage(error)))
            if(stompClient !== null) {
                ChatService.sendMessageRealTime(stompClient, currentChatRoom.id, JSON.stringify(message))
                setText("")
            }
        }
    }

    const onReceiveMessage = (messageJson) => {
        const newMessage = JSON.parse(messageJson.body)
        const isDuplicate = messageList.find(message => message.id === newMessage.id)
        if(!isDuplicate) {
            messageList.push(newMessage)
            setMessageList([...messageList])
        }
    }


    return (
        <div>
            <VerticalNav/>
            <div className="chat-container">
                <aside>
                    <ul>
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
                <main>
                    {currentChatRoom.id === "" || currentChatRoom.oppositeProfile == null ?
                        <h1 className="primary-title">Chat</h1> :
                        <div className="current-chat-room-container">
                            <header>
                                <img
                                    src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_50", "h_50", "q_100", "c_thumb"])}/>
                                <p onClick={() => {
                                    navigate("/profile/" + currentChatRoom.oppositeProfile.id)
                                }}>{currentChatRoom.oppositeProfile.name}</p>
                            </header>
                            <ul className="show-message-container">
                                {currentChatRoom.messages.map(message => {
                                    return (
                                        <li className={message.senderId === localStorage.getItem(USER_ID) ? "me" : "you"}
                                            key={message.id}>
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
                                            <div className="message">
                                                {message.text}
                                            </div>
                                        </li>
                                    )
                                }):null}
                            </ul>
                            <footer>
                            <textarea placeholder="Type your message"
                                      name="text"
                                      value={text}
                                      onChange={handleChangeText}></textarea>
                                <a href="#" onClick={handleSubmit}>Send</a>
                            </footer>
                        </div>
                    }
                </main>
            </div>
        </div>
    )
}

export default Chat