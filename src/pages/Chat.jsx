import {useEffect, useState} from "react";
import ChatService from "../api/services/chat.service.js";
import {USER_ID} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";

const Chat = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [currentChatRoom, setCurrentChatRoom] = useState({
        id: "",
        userId1: "",
        userId2: "",
        messages: [],
        oppositeProfile: null
    })
    const [profileList, setProfileList] = useState([])
    useEffect(() => {
        async function fetchData() {
            if(id) {
                await ChatService.getChatRoomById(id)
                    .then(data => {
                        setCurrentChatRoom(prevState => ({
                            ...prevState,
                            id: data.id,
                            userId1: data.userId1,
                            userId2: data.userId2,
                            messages: data.messages
                        }))
                    }).catch(error => console.log(error))
            }
            await ChatService.getAllProfilesOfChatRooms()
                .then(data => {
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

    if (currentChatRoom !== null) {
        console.log("current chatRoom", currentChatRoom)
    }
    if (profileList !== null) {
        console.log("profile list", profileList)
    }

    const renderProfileItems = () => {
        let filteredProfileList = profileList
        if(currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null) {
            filteredProfileList = profileList.filter(
                (profile) => profile.userId !== currentChatRoom.oppositeProfile.userId
            );
        }
        return filteredProfileList.map((profile) => (
            <li key={profile.userId} onClick={() => {ChatService.handleNavigate(profile.userId, navigate)}}>
                <img src={ImageService.modifyImageURI(profile.imgUrl, ["w_100", "h_100", "q_100", "c_thumb"])}/>
                <div>
                    <h2>{profile.name}</h2>
                    <h3>
                        <span className="status green"></span>
                        online
                    </h3>
                </div>
            </li>
        ));
    };

    return (
        <div className="chat-container">
            <aside>
                <ul>
                    {currentChatRoom.id !== "" && currentChatRoom.oppositeProfile !== null ?
                        <li className="selected">
                            <img src={ImageService.modifyImageURI(currentChatRoom.oppositeProfile.imgUrl, ["w_100", "h_100", "q_100", "c_thumb"])}/>
                            <div>
                                <h2>{currentChatRoom.oppositeProfile.name}</h2>
                                <h3>
                                    <span className="status green"></span>
                                    online
                                </h3>
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
                            <p>{currentChatRoom.oppositeProfile.name}</p>
                        </header>
                    </div>
                }
            </main>
        </div>
    )
}

export default Chat