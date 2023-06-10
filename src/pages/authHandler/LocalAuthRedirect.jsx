import {useNavigate} from "react-router-dom";
import {ACCESS_TOKEN} from "../../api/constant/index.js";
import {useEffect} from "react";
import UserService from "../../api/services/user.service.js";

const LocalAuthRedirect = () => {
    const navigate = useNavigate()

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
    })
}

export default LocalAuthRedirect