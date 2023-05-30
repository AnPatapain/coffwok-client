import axios from "axios";
import {API_BASE_URL} from "../endPoint/index.js";

const register = (email, password) => {
    return axios.post(API_BASE_URL + "/auth/signup", {
        email, password
    });
};

const login = (email, password) => {
    return axios.post(API_BASE_URL + "/auth/login", {
        email, password
    }).then((response) => {
        console.log(response)
        if (response.data.accessToken) {
            setUserInLocalStorage(response.data);
        }

        return response.data;
    });
};

const setUserInLocalStorage = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
};

const logout = () => {
    localStorage.removeItem("user");
};

const AuthService = {
    register,
    login,
    logout,
};
export default AuthService;