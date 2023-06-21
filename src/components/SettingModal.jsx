import {useNavigate} from "react-router-dom";

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

    return (
        <div className="setting-modal">
            <div className="close-icon" onClick={handleClick}>
                &#10006;
            </div>
            <ul>
                <li>Manage Account</li>
                <li onClick={handleLogOut}>Log out</li>
            </ul>
        </div>
    )
}
export default SettingModal;