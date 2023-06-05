import {Navigate} from "react-router-dom";
import AuthService from "../services/auth.service.js";

const OAuth2Redirect = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token")
    AuthService.setAccessTokenInLocalStorage(token);
    return <Navigate to={"/profile-creation?isEdit=false"}/>
}

export default OAuth2Redirect