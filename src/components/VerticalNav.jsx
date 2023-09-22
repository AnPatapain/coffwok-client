import LogoContainer from "./LogoContainer.jsx";


import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PROFILE_ID, PROFILE_IMG, SHOW_NOTIFICATION} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";

import home_icon from "../assets/icons/home-icon.svg"
import chat_icon from "../assets/icons/message-icon.svg"
import add_icon from "../assets/icons/add-icon.svg"
import logout_icon from "../assets/icons/logout-icon.svg"
import plan_icon from "../assets/icons/plan-icon.svg"


const VerticalNav = ({selectedItem}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [profileImg, setProfileImg] = useState("")

    useEffect(() => {
        let imgUrl = localStorage.getItem(PROFILE_IMG)

        if(imgUrl !== null) {
            imgUrl = ImageService.modifyImageURI(imgUrl, ["q_100", "w_40", "h_40", "c_fill", "g_face"])
            setProfileImg(imgUrl)
        }
    }, [])
    const handleClickHome = () => {
        if(location.pathname === "/dashboard") {
            window.location.reload()
        }else {
            navigate("/dashboard")
        }
    }

    const handleClickMessage = () => {
        navigate("/chat")
    }

    const handleClickPlan = () => {
        navigate("/plan-creation")
    }

    const handleClickProfile = () => {
        navigate("/profile/" + localStorage.getItem(PROFILE_ID))
    }

    const handleClickProfiles = () => {
        navigate("/profiles")
    }

    const handleLogOut = () => {
        localStorage.clear()
        navigate("/")
    }
    return (
        <div className="vertical-nav">
            <LogoContainer/>
            <ul>
                <li onClick={()=> {handleClickHome()} } className={selectedItem === 'dashboard' ? 'clicked' : ''}>
                    <img src={home_icon} className="ver-nav-icon"/>
                    <span className="nav-text">Home</span>
                </li>

                <li onClick={() => {handleClickMessage()}} className={selectedItem === 'message' ? 'clicked' : ''}>
                    {/*<AiOutlineMessage className="ver-nav-icon"/>*/}
                    <img src={chat_icon} className="ver-nav-icon"/>
                    {localStorage.getItem(SHOW_NOTIFICATION) && localStorage.getItem(SHOW_NOTIFICATION) !== "0" ? <div className="red-dot">{localStorage.getItem(SHOW_NOTIFICATION)}</div>:null}
                    <span className="nav-text">Messages</span>
                </li>

                <li onClick={() => {handleClickPlan()}} className={selectedItem === 'plan' ? 'clicked' : ''}>
                    {/*<BiMessageSquareAdd className="ver-nav-icon"/>*/}
                    <img src={add_icon} className="ver-nav-icon"/>
                    <span className="nav-text">New coffee-study plan</span>
                </li>

                <li onClick={()=> {handleClickProfile()}} className={selectedItem === 'profile' ? 'clicked' : ''}>
                    {profileImg ? <img src={profileImg} className="profile-img"/> : <img src={profileImg} className="ver-nav-icon"/>}
                    <span className="nav-text">Profile</span>
                </li>

                <li onClick={() => {handleLogOut()}}>
                    {/*<FiLogOut className="ver-nav-icon"/>*/}
                    <img src={logout_icon} className="ver-nav-icon"/>
                    <span className="nav-text">Logout</span>
                </li>
            </ul>
        </div>
    )
}

export default VerticalNav