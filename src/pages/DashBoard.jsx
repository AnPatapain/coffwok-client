import VerticalNav from "../components/VerticalNav.jsx";
import {useEffect} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {useNavigate} from "react-router-dom";
import localStorageService from "../api/services/localStorage.service.js";
import ImageService from "../api/services/image.service.js";
import {PROFILE_IMG} from "../api/constant/index.js";

const DashBoard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        ProfileService.getMyProfile()
            .then(data => {
                console.log(data)
                localStorageService.add(PROFILE_IMG, data.imgUrl)
            })
            .catch(error => {
                const errMsg = getErrorMessage(error)
                console.log(errMsg)
                navigate("/")
            })
    }, [])
    return (
        <div className="plans-container">
            <VerticalNav />
        </div>
    )
}

export default DashBoard