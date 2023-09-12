import RequestService from "./request.service.js";
import {ACCESS_TOKEN, API_BASE_URL, USER_ID} from "../constant/index.js";
import {getErrorMessage} from "../error/errorMessage.js";
import SockJS from 'sockjs-client/dist/sockjs.js'
import Stomp from 'stompjs'

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
            window.location.reload()
        }).catch(error => console.log(error))
}

const sendMessage = (chat_room_id, messageDTO) => {
    return RequestService.postRequestJson(API_BASE_URL + "/api/chat_rooms/" + chat_room_id, messageDTO)
}

const connect_socket = (chatRoomId, onReceiveMessage) => {
    let socket = new SockJS(API_BASE_URL + "/web-socket-endpoint")
    let stompClient = Stomp.over(socket)
    const token = "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    stompClient.connect(
        {Authorization: token},
        function (frame) {
            console.log("connected: " + frame)
            // stompClient.unsubscribe("/chatroom/" + chatRoomId);
            stompClient.subscribe("/chatroom/" + chatRoomId, onReceiveMessage)
        })
    return stompClient
}

const sendMessageRealTime = (stompClient, chatRoomId, message) => {
    console.log("sending message")
    stompClient.send("/api/chat/" + chatRoomId, {}, message)
}


const ChatService = {
    getAllMyChatRooms,
    getAllProfilesOfChatRooms,
    getChatRoomByUsers,
    getChatRoomById,
    sendMessage,
    handleNavigate,
    connect_socket,
    sendMessageRealTime
}

export default ChatService