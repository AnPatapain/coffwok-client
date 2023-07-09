import {AiOutlineDislike, AiOutlineLike, AiOutlineMessage} from "react-icons/ai";
import {TbSchool} from "react-icons/tb";
import {GoLocation} from "react-icons/go";
import {MdSchedule} from "react-icons/md";
import ImageService from "../api/services/image.service.js";
import UserService from "../api/services/user.service.js";
import {useNavigate} from "react-router-dom";
import ChatService from "../api/services/chat.service.js";
import {BsBook, BsPeople} from "react-icons/bs";

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

    const handleClickChatIcon = (userId) => {
        ChatService.handleNavigate(userId, navigate)
    }
    return (
        <div className="plan-card">
            <section className="name-button-section">
                {/* eslint-disable-next-line react/prop-types */}
                {planInfo.imgUrl !== null ?
                    <img className="small-profile-image"
                         src={ImageService.modifyImageURI(planInfo.imgUrl, ["w_50", "h_50", "c_fill", "g_face", "q_100"])}/> : null}

                <article>
                    <p onClick={() => {
                        handleClickName(planInfo.userId)
                    }} className="name">
                        {planInfo.name}
                    </p>

                    {
                        !isOwner ?
                        <span className="message-button" onClick={() => {
                            handleClickChatIcon(planInfo.userId)
                        }}>
                            Rủ đi học chung
                        </span> : ""
                    }
                </article>
            </section>
            <ul className="plan-info-section">
                <li className="plan-info-item">
                    <span><TbSchool className="icon"/>Trường</span>
                    <span className="text">{planInfo.school}</span>
                </li>
                <li className="plan-info-item">
                    <span><GoLocation className="icon"/>Cà Phê</span>
                    <span className="text">{planInfo.coffeeShop}</span>
                </li>
                <li className="plan-info-item">
                    <span><MdSchedule className="icon"/>Thời Gian</span>
                    <span className="text">{planInfo.schedule}</span>
                </li>
                {/*<li className="plan-info-item">*/}
                {/*    <span><AiOutlineLike className="icon"/>Có thể kèm</span>*/}
                {/*    <span className="text">{planInfo.strength_subjects.slice(0, 3).join(", ")} ...</span>*/}
                {/*</li>*/}
                {/*<li className="plan-info-item">*/}
                {/*    <span><AiOutlineDislike className="icon"/>Cần người kèm</span>*/}
                {/*    <span className="text">{planInfo.weak_subjects.slice(0, 3).join(", ")} ...</span>*/}
                {/*</li>*/}
                <li className="plan-info-item">
                    <span>
                        <BsBook className="icon"/>Tìm bạn học chung
                    </span>
                    <span className="text">{planInfo.planDetails}</span>
                </li>
            </ul>
        </div>
    )
}

export default PlanCard