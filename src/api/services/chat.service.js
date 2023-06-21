import RequestService from "./request.service.js";
import {API_BASE_URL, USER_ID} from "../constant/index.js";
import {getErrorMessage} from "../error/errorMessage.js";

const getChatRoomByUsers = (userId1, userId2) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/chat_rooms" + "?user_id1=" + userId1 + "&" + "user_id2=" + userId2)
            .then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(getErrorMessage(error))
        })
    })
}

const getAllMyChatRooms = () => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/chat_rooms/me")
            .then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(getErrorMessage(error))
        })
    })
}

const getAllProfilesOfChatRooms = () => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/chat_rooms/profiles")
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const getChatRoomById = (chatRoomId) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/chat_rooms/" + chatRoomId)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(getErrorMessage(error))
            })
    })
}

const handleNavigate = (oppositeUserId, navigate) => {
    getChatRoomByUsers(oppositeUserId, localStorage.getItem(USER_ID))
        .then(data => {
            navigate("/chat/" + data.id)
        }).catch(error => console.log(error))
}

const sendMessage = (chat_room_id, messageDTO) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/chat_rooms/" + chat_room_id, messageDTO)
}


const ChatService = {
    getAllMyChatRooms,
    getAllProfilesOfChatRooms,
    getChatRoomByUsers,
    getChatRoomById,
    sendMessage,
    handleNavigate
}

export default ChatService