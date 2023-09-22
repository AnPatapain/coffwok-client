import {useState} from "react";
import pink_location_icon from "../assets/icons/pink-location-icon.svg"
import clock_icon from "../assets/icons/clock-icon.svg"
import study_icon from "../assets/icons/study-icon.svg"
import edit_icon from "../assets/icons/edit-icon.svg"

// eslint-disable-next-line react/prop-types
const PlanCreationEditCard = ({planInfo, planDTO, setPlanDTO, oldPlan}) => {
    const [isClickCafe, setIsClickCafe] = useState(false)

    const [isClickSchedule, setIsClickSchedule] = useState(false)

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
                    <article className="category">
                        <img src={pink_location_icon} className="icon"/>
                        <label htmlFor="cafe">Café</label>
                    </article>

                    {
                        oldPlan && !isClickCafe ?

                            <span className="text">
                                        {oldPlan.coffeeShop}
                                <img src={edit_icon} className="edit-icon" onClick={() => {
                                    setIsClickCafe(true)
                                }}/>
                            </span>
                            :
                            <input id="cafe"
                                   type="text"
                                   name="coffeeShop"
                                   required={true}
                                   value={planDTO.coffeeShop}
                                   placeholder="Your favorite café"
                                   onChange={handleChange}/>
                    }

                </li>
                <li className="plan-info-item">
                    <article className="category">
                        <img src={clock_icon} className="icon"/>
                        <label htmlFor="schedule">Schedule</label>
                    </article>

                    {
                        oldPlan && !isClickSchedule ?

                            <span className="text">
                                        {oldPlan.schedule}
                                <img src={edit_icon} className="edit-icon" onClick={() => {
                                    setIsClickSchedule(true)
                                }}/>
                                {/*<SlPencil className="edit-icon" onClick={() => {setIsClickSchedule(true)}}/>*/}
                            </span>
                            :
                            <input id="schedule"
                                   type="text"
                                   name="schedule"
                                   required={true}
                                   value={planDTO.schedule}
                                   placeholder="9:am Tomorrow"
                                   onChange={handleChange}/>
                    }


                </li>
                <li className="plan-info-item">
                    <article className="category">
                        <img src={study_icon} className="icon"/>
                        <label htmlFor="planDetails">Find study partner in</label>
                    </article>

                    {
                        oldPlan && !isClickPlanDetails ?

                            <span className="text">
                                        {oldPlan.planDetails}
                                <img src={edit_icon} className="edit-icon" onClick={() => {
                                    setIsClickPlanDetails(true)
                                }}/>
                                {/*<SlPencil className="edit-icon" onClick={() => {setIsClickPlanDetails(true)}}/>*/}
                            </span>
                            :
                            <input id="planDetails"
                                   type="text"
                                   name="planDetails"
                                   required={true}
                                   value={planDTO.planDetails}
                                   placeholder="Physics, English, Coding, ..."
                                   onChange={handleChange}/>
                    }


                </li>
            </ul>
        </div>
    )
}

export default PlanCreationEditCard