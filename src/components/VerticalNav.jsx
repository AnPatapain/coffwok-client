import LogoContainer from "./LogoContainer.jsx";
import {BiHomeAlt2, BiMessageSquareAdd} from "react-icons/bi";
import {AiOutlineMessage} from "react-icons/ai";
import {IoIosAddCircleOutline, IoMdNotificationsOutline} from "react-icons/io";
import {CgProfile} from "react-icons/cg";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PROFILE_ID, PROFILE_IMG} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";

const VerticalNav = () => {
    const navigate = useNavigate()
    const [profileImg, setProfileImg] = useState("")

    useEffect(() => {
        let imgUrl = localStorage.getItem(PROFILE_IMG)

        if(imgUrl !== null) {
            imgUrl = ImageService.modifyImageURI(imgUrl, ["q_100", "w_40", "h_40", "c_fill", "g_face"])
            setProfileImg(imgUrl)
        }
    }, [])
    return (
        <div className="vertical-nav">
            <LogoContainer/>
            <ul>
                <li onClick={()=> {navigate("/dashboard")} } >
                    <BiHomeAlt2 className="ver-nav-icon"/>
                    <span className="nav-text">Home</span>
                </li>
                <li onClick={() => {navigate("/chat")} }>
                    <AiOutlineMessage className="ver-nav-icon"/>
                    <span className="nav-text">Messages</span>
                </li>
                <li>
                    <IoMdNotificationsOutline className="ver-nav-icon"/>
                    <span className="nav-text">Notifications</span>
                </li>
                <li onClick={() => {navigate("/plan-creation")}}>
                    <BiMessageSquareAdd className="ver-nav-icon"/>
                    <span className="nav-text">Create plan</span>
                </li>
                <li onClick={()=> {navigate("/profile/" + localStorage.getItem(PROFILE_ID))} }>
                    {profileImg ? <img src={profileImg} className="profile-img"/> : <CgProfile className="ver-nav-icon"/>}
                    <span className="nav-text">Profile</span>
                </li>
            </ul>
        </div>
    )
}

export default VerticalNav