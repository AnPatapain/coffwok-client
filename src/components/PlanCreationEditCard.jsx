import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai";
import {TbSchool} from "react-icons/tb";
import {GoLocation} from "react-icons/go";
import {MdSchedule} from "react-icons/md";
import {SlPencil} from "react-icons/sl"
import {useState} from "react";

// eslint-disable-next-line react/prop-types
const PlanCreationEditCard = ({planInfo, planDTO, setPlanDTO, oldPlan}) => {
    const [isClick, setIsClick] = useState(false)
    const handleChange = (e) => {
        let value = e.target.value
        let name = e.target.name
        setPlanDTO(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    return (
        <div className="plan-card">
            <section className="image-container">
                <img
                    src={planInfo.imgUrl}/>
            </section>
            <section className="name-button-section">
                <p>{planInfo.name}</p>
            </section>
            <ul className="plan-info-section">
                <li className="plan-info-item">
                    <span><TbSchool className="icon"/>School</span>
                    <span className="text">{planInfo.school}</span>
                </li>
                <li className="plan-info-item">
                    <span>
                        <GoLocation className="icon"/>
                        <label htmlFor="cafe">Café</label>
                    </span>
                    <span>
                        {
                            oldPlan && !isClick ?
                                <article>
                                    <span className="text">
                                        {oldPlan.coffeeShop}
                                        <SlPencil className="edit-icon" onClick={() => {setIsClick(true)}}/>
                                    </span>
                                </article> :
                                <input id="cafe"
                                       type="text"
                                       name="coffeeShop"
                                       required={true}
                                       value={planDTO.coffeeShop}
                                       placeholder="Glife"
                                       onChange={handleChange}/>
                        }
                    </span>
                </li>
                <li className="plan-info-item">
                    <span>
                        <MdSchedule className="icon"/>
                        <label htmlFor="schedule">Schedule</label>
                    </span>
                    <span>
                        {
                            oldPlan && !isClick ?
                                <article>
                                    <span className="text">
                                        {oldPlan.schedule}
                                        <SlPencil className="edit-icon" onClick={() => {setIsClick(true)}}/>
                                    </span>
                                </article> :
                                <input id="schedule"
                                       type="text"
                                       name="schedule"
                                       required={true}
                                       value={planDTO.schedule}
                                       placeholder="7h-9h tomorrow"
                                       onChange={handleChange}/>
                        }

                    </span>
                </li>
                <li className="plan-info-item">
                    <span><AiOutlineLike className="icon"/>Strengths</span>
                    <span className="text">{planInfo.strength_subjects.slice(0, 2).join(", ")} ...</span>
                </li>
                <li className="plan-info-item">
                    <span><AiOutlineDislike className="icon"/>Weakness</span>
                    <span className="text">{planInfo.weak_subjects.slice(0, 2).join(", ")} ...</span>
                </li>
            </ul>
            {/*<button className="primary-button" onClick={submitPlan}>Publish Plan</button>*/}
        </div>
    )
}

export default PlanCreationEditCard