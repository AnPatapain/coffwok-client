import {AiOutlineDislike, AiOutlineLike, AiOutlineMessage} from "react-icons/ai";
import {TbSchool} from "react-icons/tb";
import {GoLocation} from "react-icons/go";
import {MdSchedule} from "react-icons/md";

// eslint-disable-next-line react/prop-types
const PlanCard = ({planInfo}) => {
    return (
        <div className="plan-card">
            <section className="image-container">
                <img
                    src={planInfo.imgUrl}/>
            </section>
            <section className="name-button-section">
                <p>{planInfo.name}</p>
                <AiOutlineMessage className="chat-icon"/>
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
                    <span><AiOutlineLike className="icon"/>My Strengths</span>
                    <span className="text">{planInfo.strength_subjects.join(", ")}</span>
                </li>
                <li className="plan-info-item">
                    <span><AiOutlineDislike className="icon"/>My Weakness</span>
                    <span className="text">{planInfo.weak_subjects.join(", ")}</span>
                </li>
            </ul>
        </div>
    )
}

export default PlanCard