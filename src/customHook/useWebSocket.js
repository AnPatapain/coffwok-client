import { useEffect, useRef, useState } from 'react';
import Stomp from 'stompjs';
import {API_BASE_URL} from "../api/constant/index.js";

const useWebSocket = (endpoint, topic, onMessage) => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebSocket = async () => {
            const socket = new WebSocket(API_BASE_URL + "/web-socket-endpoint")
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
                setIsConnected(true);
                stompClient.subscribe(topic, onMessage);
            });

            stompClientRef.current = stompClient;
        };

        connectWebSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [endpoint, topic, onMessage]);

    return { isConnected, stompClient: stompClientRef.current };
};

export default useWebSocket;
