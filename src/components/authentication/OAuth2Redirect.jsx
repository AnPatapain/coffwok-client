import {Navigate} from "react-router-dom";
import AuthService from "../../api/services/auth.service.js";

const OAuth2Redirect = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token")
    AuthService.setAccessTokenInLocalStorage(token);
    return <Navigate to={"/profile-info-creation?isEdit=false"}/>
}

export default OAuth2Redirect