import {useNavigate} from "react-router-dom";
import AuthService from "../../api/services/auth.service.js";
import UserService from "../../api/services/user.service.js";
import {useEffect} from "react";
import {ACCESS_TOKEN} from "../../api/constant/index.js";

const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const url = new URL(window.location.href)
    const token = url.searchParams.get("token")
    AuthService.setAccessTokenInLocalStorage(token)

    useEffect(() => {
        UserService.getCurrentUser()
            .then(user => {
                if(user.profileId === null) {
                    navigate("/profile-info-creation?isEdit=false")
                }else {
                    navigate("/profile")
                }
            })
            .catch(error => {
                if(localStorage.getItem(ACCESS_TOKEN)) {
                    localStorage.removeItem(ACCESS_TOKEN)
                }
                navigate("/")
            })
    }, [])
}

export default OAuth2Redirect