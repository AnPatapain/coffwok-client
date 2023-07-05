import LogoContainer from "./LogoContainer.jsx";
import {BiHomeAlt2, BiMessageSquareAdd} from "react-icons/bi";
import {AiOutlineMessage} from "react-icons/ai";
import {CgProfile} from "react-icons/cg";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PROFILE_ID, PROFILE_IMG, SHOW_NOTIFICATION} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";

import {GrUserSettings} from "react-icons/gr"
import {IoMdNotificationsOutline} from "react-icons/io";
import SettingModal from "./SettingModal.jsx";
import {FiLogOut} from "react-icons/fi";

const VerticalNav = () => {
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

    const handleLogOut = () => {
        localStorage.clear()
        navigate("/")
    }
    return (
        <div className="vertical-nav">
            <LogoContainer/>
            <ul>
                <li onClick={()=> {handleClickHome()} } >
                    <BiHomeAlt2 className="ver-nav-icon"/>

                    <span className="nav-text">Trang Chủ</span>
                </li>
                <li onClick={() => {handleClickMessage()}}>
                    <AiOutlineMessage className="ver-nav-icon"/>
                    {localStorage.getItem(SHOW_NOTIFICATION) && localStorage.getItem(SHOW_NOTIFICATION) !== "0" ? <div className="red-dot">{localStorage.getItem(SHOW_NOTIFICATION)}</div>:null}
                    <span className="nav-text">Tin Nhắn</span>
                </li>
                {/*<li>*/}
                {/*    <IoMdNotificationsOutline className="ver-nav-icon"/>*/}
                {/*    <span className="nav-text">Notifications</span>*/}
                {/*</li>*/}
                <li onClick={() => {navigate("/plan-creation")}}>
                    <BiMessageSquareAdd className="ver-nav-icon"/>
                    <span className="nav-text">Tạo Kế Hoạch</span>
                </li>
                <li onClick={()=> {navigate("/profile/" + localStorage.getItem(PROFILE_ID))} }>
                    {profileImg ? <img src={profileImg} className="profile-img"/> : <CgProfile className="ver-nav-icon"/>}
                    <span className="nav-text">Profile</span>
                </li>
                <li onClick={() => {handleLogOut()}}>
                    <FiLogOut className="ver-nav-icon"/>
                    <span className="nav-text">Đăng xuất</span>
                </li>
            </ul>
        </div>
    )
}

export default VerticalNav