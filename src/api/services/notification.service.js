import {ACCESS_TOKEN, API_BASE_URL} from "../constant/index.js";
import SockJS from 'sockjs-client/dist/sockjs.js'
import Stomp from 'stompjs'
import RequestService from "./request.service.js";
import {getErrorMessage} from "../error/errorMessage.js";

const getNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        RequestService.getRequest(API_BASE_URL + "/api/notification/all/" + userId)
            .then(response => {
                resolve(response.data)
            }).catch(error => {
            reject(getErrorMessage(error))
        })
    })
}

const removeNotificationForChatRoom = (chatRoomId) => {
    return new Promise((resolve, reject) => {
        RequestService.deleteRequest(API_BASE_URL + "/api/notification/remove/" + chatRoomId)
            .then(response => resolve(response.data))
            .catch(error => {reject(getErrorMessage(error))})
    })
}

const connect_notification_endpoint = (userId, onReceiveNotification) => {
    let socket = new SockJS(API_BASE_URL + "/web-socket-endpoint")
    let stompClient = Stomp.over(socket)
    const token = "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    stompClient.connect(
        {Authorization: token},
        function (frame) {
            console.log("connected: " + frame)
            stompClient.subscribe("/notification/" + userId, onReceiveNotification)
        })
    return stompClient
}

const NotificationService = {
    connect_notification_endpoint,
    getNotifications,
    removeNotificationForChatRoom
}

export default NotificationService
