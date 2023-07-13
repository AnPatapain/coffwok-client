import LogoContainer from "./LogoContainer.jsx";
// import {BiHomeAlt2, BiMessageSquareAdd} from "react-icons/bi";
// import {AiOutlineMessage} from "react-icons/ai";
// import {CgProfile} from "react-icons/cg";
// import {FiLogOut} from "react-icons/fi";


import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PROFILE_ID, PROFILE_IMG, SHOW_NOTIFICATION} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";

import home_icon from "../assets/icons/home-icon.svg"
import chat_icon from "../assets/icons/message-icon.svg"
import add_icon from "../assets/icons/add-icon.svg"
import profile_icon from "../assets/icons/profile-icon.svg"
import logout_icon from "../assets/icons/logout-icon.svg"


const VerticalNav = ({selectedItem}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [profileImg, setProfileImg] = useState("")
    const [showSettingModal, setShowSettingModal] = useState(false)

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

    const handleLogOut = () => {
        localStorage.clear()
        navigate("/")
    }
    return (
        <div className="vertical-nav">
            <LogoContainer/>
            <ul>
                <li onClick={()=> {handleClickHome()} } className={selectedItem === 'dashboard' ? 'clicked' : ''}>
                    {/*<BiHomeAlt2 className="ver-nav-icon"/>*/}
                    <img src={home_icon} className="ver-nav-icon"/>
                    <span className="nav-text">Trang Chủ</span>
                </li>

                <li onClick={() => {handleClickMessage()}} className={selectedItem === 'message' ? 'clicked' : ''}>
                    {/*<AiOutlineMessage className="ver-nav-icon"/>*/}
                    <img src={chat_icon} className="ver-nav-icon"/>
                    {localStorage.getItem(SHOW_NOTIFICATION) && localStorage.getItem(SHOW_NOTIFICATION) !== "0" ? <div className="red-dot">{localStorage.getItem(SHOW_NOTIFICATION)}</div>:null}
                    <span className="nav-text">Tin nhắn</span>
                </li>

                <li onClick={() => {handleClickPlan()}} className={selectedItem === 'plan' ? 'clicked' : ''}>
                    {/*<BiMessageSquareAdd className="ver-nav-icon"/>*/}
                    <img src={add_icon} className="ver-nav-icon"/>
                    <span className="nav-text">Tạo kế hoạch</span>
                </li>

                <li onClick={()=> {handleClickProfile()}} className={selectedItem === 'profile' ? 'clicked' : ''}>
                    {profileImg ? <img src={profileImg} className="profile-img"/> : <img src={profileImg} className="ver-nav-icon"/>}
                    <span className="nav-text">Trang cá nhân</span>
                </li>

                <li onClick={() => {handleLogOut()}}>
                    {/*<FiLogOut className="ver-nav-icon"/>*/}
                    <img src={logout_icon} className="ver-nav-icon"/>
                    <span className="nav-text">Đăng xuất</span>
                </li>
            </ul>
        </div>
    )
}

export default VerticalNav