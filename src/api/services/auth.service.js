import axios from "axios";
import {ACCESS_TOKEN, API_BASE_URL} from "../constant/index.js";

const register = (email, password) => {
    return axios.post(API_BASE_URL + "/api/auth/signup", {
        email, password
    });
};

const login = (email, password) => {
    return axios.post(API_BASE_URL + "/api/auth/login", {
        email, password
    }).then((response) => {
        console.log(response)
        if (response.data.accessToken) {
            setAccessTokenInLocalStorage(response.data.accessToken);
        }
        return response.data;
    });
};

const setAccessTokenInLocalStorage = (token) => {
    // alert(token)
    localStorage.setItem(ACCESS_TOKEN, token);
};

const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
};

const AuthService = {
    register,
    login,
    logout,
    setAccessTokenInLocalStorage
};
export default AuthService;