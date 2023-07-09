// import {TbSchool} from "react-icons/tb";
// import {GoLocation} from "react-icons/go";
// import {MdSchedule} from "react-icons/md";
// import {SlPencil} from "react-icons/sl"
// import {BsBook, BsPeople} from "react-icons/bs"
import {useState} from "react";

// eslint-disable-next-line react/prop-types
const PlanCreationEditCard = ({planInfo, planDTO, setPlanDTO, oldPlan}) => {
    const [isClickCafe, setIsClickCafe] = useState(false)

    const [isClickSchedule,setIsClickSchedule] = useState(false)

    const [isClickPlanDetails, setIsClickPlanDetails] = useState(false)
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
            <section className="name-button-section">
                {/* eslint-disable-next-line react/prop-types */}
                <img className="small-profile-image"
                    src={planInfo.imgUrl}/>
                <p>{planInfo.name}</p>
            </section>
            <ul className="plan-info-section">
                <li className="plan-info-item">
                    {/*<span><TbSchool className="icon"/>Học tại</span>*/}
                    <span className="text">{planInfo.school}</span>
                </li>
                <li className="plan-info-item">
                    <span>
                        {/*<GoLocation className="icon"/>*/}
                        <label htmlFor="cafe">Cà phê</label>
                    </span>
                    <span>
                        {
                            oldPlan && !isClickCafe ?
                                <article>
                                    <span className="text">
                                        {oldPlan.coffeeShop}
                                        {/*<SlPencil className="edit-icon" onClick={() => {setIsClickCafe(true)}}/>*/}
                                    </span>
                                </article> :
                                <input id="cafe"
                                       type="text"
                                       name="coffeeShop"
                                       required={true}
                                       value={planDTO.coffeeShop}
                                       placeholder="Glife 111 Phan Đình Phùng"
                                       onChange={handleChange}/>
                        }
                    </span>
                </li>
                <li className="plan-info-item">
                    <span>
                        {/*<MdSchedule className="icon"/>*/}
                        <label htmlFor="schedule">Thời gian</label>
                    </span>
                    <span>
                        {
                            oldPlan && !isClickSchedule ?
                                <article>
                                    <span className="text">
                                        {oldPlan.schedule}
                                        {/*<SlPencil className="edit-icon" onClick={() => {setIsClickSchedule(true)}}/>*/}
                                    </span>
                                </article> :
                                <input id="schedule"
                                       type="text"
                                       name="schedule"
                                       required={true}
                                       value={planDTO.schedule}
                                       placeholder="7h-9h Ngày mai / Hôm nay "
                                       onChange={handleChange}/>
                        }

                    </span>
                </li>
                <li className="plan-info-item">
                    <span>
                        {/*<BsPeople className="icon"/>*/}
                        {/*<BsBook className="icon"/>*/}
                        <label htmlFor="planDetails">Tìm bạn học chung</label>
                    </span>
                    <span>
                        {
                            oldPlan && !isClickPlanDetails ?
                                <article>
                                    <span className="text">
                                        {oldPlan.planDetails}
                                        {/*<SlPencil className="edit-icon" onClick={() => {setIsClickPlanDetails(true)}}/>*/}
                                    </span>
                                </article> :
                                <input id="planDetails"
                                       type="text"
                                       name="planDetails"
                                       required={true}
                                       value={planDTO.planDetails}
                                       placeholder="Anh, Toán, Lý, Văn ..."
                                       onChange={handleChange}/>
                        }

                    </span>
                </li>
            </ul>
        </div>
    )
}

export default PlanCreationEditCard