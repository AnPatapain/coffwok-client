import LogoContainer from "./LogoContainer.jsx";
import {BiHomeAlt2, BiMessageSquareAdd} from "react-icons/bi";
import {AiOutlineMessage} from "react-icons/ai";
import {IoMdNotificationsOutline} from "react-icons/io";
import {CgProfile} from "react-icons/cg";
import {useNavigate} from "react-router-dom";

const VerticalNav = () => {
    const navigate = useNavigate()
    return (
        <div className="vertical-nav">
            <LogoContainer/>
            <ul>
                <li onClick={()=> {navigate("/")} } >
                    <BiHomeAlt2 className="ver-nav-icon"/>
                    <span className="nav-text">Home</span>
                </li>
                <li>
                    <AiOutlineMessage className="ver-nav-icon"/>
                    <span className="nav-text">Messages</span>
                </li>
                <li>
                    <IoMdNotificationsOutline className="ver-nav-icon"/>
                    <span className="nav-text">Notifications</span>
                </li>
                <li>
                    <BiMessageSquareAdd className="ver-nav-icon"/>
                    <span className="nav-text">Create plan</span>
                </li>
                <li onClick={()=> {navigate("/profile")} }>
                    <CgProfile className="ver-nav-icon"/>
                    <span className="nav-text">Profile</span>
                </li>
            </ul>
        </div>
    )
}

export default VerticalNav