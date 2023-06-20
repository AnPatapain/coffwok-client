import {AiOutlineDislike, AiOutlineLike, AiOutlineMessage} from "react-icons/ai";
import {TbSchool} from "react-icons/tb";
import {GoLocation} from "react-icons/go";
import {MdSchedule} from "react-icons/md";
import ImageService from "../api/services/image.service.js";
import UserService from "../api/services/user.service.js";
import ProfileService from "../api/services/profile.service.js";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PlanCard = ({planInfo, isOwner}) => {
    const navigate = useNavigate()
    const handleClickName = (userId) => {
        UserService.getUserById(userId)
            .then(data => {
                navigate("/profile/" + data.profileId)
            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div className="plan-card">
            <section className="image-container">
                <img
                    src={ImageService.modifyImageURI(planInfo.imgUrl, ["w_350", "h_250", "c_fill", "g_face", "q_100"])}/>
            </section>
            <section className="name-button-section">
                <p onClick={() => {handleClickName(planInfo.userId)} }>{planInfo.name}</p>
                {!isOwner ? <AiOutlineMessage className="chat-icon"/>:""}
            </section>
            <ul className="plan-info-section">
                <li className="plan-info-item">
                    <span><TbSchool className="icon"/>School</span>
                    <span className="text">{planInfo.school}</span>
                </li>
                <li className="plan-info-item">
                    <span><GoLocation className="icon"/>Café</span>
                    <span className="text">{planInfo.coffeeShop}</span>
                </li>
                <li className="plan-info-item">
                    <span><MdSchedule className="icon"/>Schedule</span>
                    <span className="text">{planInfo.schedule}</span>
                </li>
                <li className="plan-info-item">
                    <span><AiOutlineLike className="icon"/>Strengths</span>
                    <span className="text">{planInfo.strength_subjects.slice(0, 2).join(", ")}</span>
                </li>
                <li className="plan-info-item">
                    <span><AiOutlineDislike className="icon"/>Weakness</span>
                    <span className="text">{planInfo.weak_subjects.slice(0, 2).join(", ")}</span>
                </li>
            </ul>
        </div>
    )
}

export default PlanCard