import VerticalNav from "../components/VerticalNav.jsx";

import {TbSchool} from "react-icons/tb"
import {AiOutlineLike} from "react-icons/ai"
import {AiOutlineDislike} from "react-icons/ai"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import {PROFILE_IMG} from "../api/constant/index.js";
import ImageService from "../api/services/image.service.js";
import PlanCard from "../components/PlanCard.jsx";
import PlanService from "../api/services/plan.service.js";
import {IoIosAddCircleOutline} from "react-icons/io"


const MyProfile = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        gender_identity: "",
        about: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    const [planInfo, setPlanInfo] = useState({
        id: "",
        imgUrl: localStorage.getItem(PROFILE_IMG) ? ImageService.modifyImageURI(localStorage.getItem(PROFILE_IMG), ["w_350", "h_250", "c_fill", "g_face", "q_100"]) : "",
        name: "",
        coffeeShop: "",
        schedule: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    useEffect(() => {
        ProfileService.getMyProfile()
            .then(data => {
                setProfile(data)
                setPlanInfo(prevState => ({
                    ...prevState,
                    imgUrl: ImageService.modifyImageURI(data.imgUrl, ["w_350", "h_250", "c_fill", "g_face", "q_100"]),
                    name: data.name,
                    school: data.school,
                    strength_subjects: data.strength_subjects,
                    weak_subjects: data.weak_subjects
                }))
                PlanService.getMyPlan()
                    .then(data => {
                        setPlanInfo(prevState => ({
                            ...prevState,
                            id: data.id,
                            coffeeShop: data.coffeeShop,
                            schedule: data.schedule
                        }))
                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                const errMsg = getErrorMessage(error)
                console.log(errMsg)
                navigate("/")
            })
    }, [])

    const calculateAge = (birthYear) => {
        const currentYear = new Date().getFullYear();
        const yearDifference = currentYear - parseInt(birthYear);
        // Check if the user's birthday has passed in the current year
        const birthdayHasPassed = new Date().getTime() > new Date(currentYear, new Date().getMonth(), new Date().getDate()).getTime();
        // Adjust age based on whether the birthday has passed or not
        const age = birthdayHasPassed ? yearDifference : yearDifference - 1;
        return age;
    }

    const handleDelete = () => {
        PlanService.deletePlan(planInfo.id)
            .then(response => {
                navigate("/dashboard")
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                navigate("/dashboard")
            })
    }

    return (
        <div className="profile-container">
            <VerticalNav/>
            <div className="profile-section-container">
                <section className="profile-section profile-personal-info-section">
                    <div>
                        <section className="image-container">
                            {localStorage.getItem(PROFILE_IMG) ? <img src={localStorage.getItem(PROFILE_IMG)}/> :
                                <img src={profile.imgUrl}/>}
                            <button className="primary-button" onClick={() => {
                                navigate(`/profile-image-creation`)
                            }}>Change image
                            </button>
                        </section>

                        <section className="personal-info">
                            <section className="name-button">
                                <span className="username">{profile.name}</span>
                                <button className="primary-button" onClick={() => {
                                    navigate(`/profile-info-creation?isEdit=true`)
                                }}>Edit Info
                                </button>
                            </section>
                            <p className="about">{profile.about}</p>
                            <section className="profile-sub-info">
                                <article>
                                    <span>130 visitors</span>
                                    <span>10 love</span>
                                </article>
                            </section>
                        </section>
                    </div>
                </section>

                <section className="profile-section profile-study-info-section">
                    <article>
                        <span className="category"><TbSchool className="study-info-icon"/> School</span>
                        <span>{profile.school}</span>
                    </article>
                    <article>
                        <span className="category"><AiOutlineLike className="study-info-icon"/> Good</span>
                        <span>{profile.strength_subjects.join(", ")}</span>
                    </article>
                    <article>
                        <span className="category"><AiOutlineDislike className="study-info-icon"/> Bad</span>
                        <span>{profile.weak_subjects.join(", ")}</span>
                    </article>
                </section>
                <section className="profile-section profile-coffee-study-plan-section">
                    {!planInfo.id ? <h2>Create Café-Study Plan</h2> : <h2>Café-Study Plan</h2>}
                    {!planInfo.id ? <IoIosAddCircleOutline className="add-plan-icon" onClick={() => {navigate("/plan-creation")}}/> :
                        <>
                            <PlanCard planInfo={planInfo}/>
                            <div className="buttons">
                                <button className="primary-button edit-button" onClick={() => {
                                    navigate("/plan-creation")
                                }}>Edit
                                </button>
                                <button className="primary-button delete-button" onClick={handleDelete}>Delete</button>
                            </div>
                        </>}
                </section>
            </div>
        </div>
    )
}

export default MyProfile