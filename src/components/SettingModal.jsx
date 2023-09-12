import {useNavigate} from "react-router-dom";
import userService from "../api/services/user.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {USER_ID} from "../api/constant/index.js";

// eslint-disable-next-line react/prop-types
const SettingModal = ({setShowModal}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleLogOut = () => {
        localStorage.clear()
        navigate("/")
    }
    const handleDeleteAccount = () =>{
        userService.deleteUserById(localStorage.getItem(USER_ID))
            .then(resopnse =>{
                handleLogOut()
            })
            .catch(error =>{
                console.log((getErrorMessage(error)))
                navigate(("/dashboard"))
            })
    }

    return (
        <div className="setting-modal">
            <div className="close-icon" onClick={handleClick}>
                &#10006;
            </div>
            <ul>
                {/*<li onClick={handleDeleteAccount}>Delete Account</li>*/}
                <li onClick={handleLogOut}>Log out</li>
            </ul>
        </div>
    )
}
export default SettingModal;