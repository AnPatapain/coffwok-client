import coffwokLogo from "../assets/coffwok-logo.png";
import {useNavigate} from "react-router-dom";

const LogoContainer = () => {
    const navigate = useNavigate()
    const handleClickHome = () => {
        if(location.pathname === "/dashboard") {
            window.location.reload()
        }else {
            navigate("/dashboard")
        }
    }
    return (
        <div className="logo-container">
            <img className="logo" src={coffwokLogo} onClick={handleClickHome}/>
            <h3 onClick={handleClickHome}>Coffwok</h3>
        </div>
    )
}

export default LogoContainer