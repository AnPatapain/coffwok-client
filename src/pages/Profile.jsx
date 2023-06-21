import VerticalNav from "../components/VerticalNav.jsx";

import {TbSchool} from "react-icons/tb"
import {AiOutlineLike, AiOutlineMessage} from "react-icons/ai"
import {AiOutlineDislike} from "react-icons/ai"
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js";
import ImageService from "../api/services/image.service.js";
import PlanCard from "../components/PlanCard.jsx";
import PlanService from "../api/services/plan.service.js";
import {IoIosAddCircleOutline} from "react-icons/io"
import {PROFILE_ID} from "../api/constant/index.js";
import ChatService from "../api/services/chat.service.js";


const Profile = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const isMe = id === localStorage.getItem(PROFILE_ID) ? true : false
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
        imgUrl: "",
        name: "",
        coffeeShop: "",
        schedule: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    useEffect(() => {
        async function myFunc() {
            await ProfileService.getProfileById(id)
                .then(data => {
                    console.log(data)
                    setProfile(data)
                    setPlanInfo(prevState => ({
                        ...prevState,
                        imgUrl: ImageService.modifyImageURI(data.imgUrl, ["w_350", "h_250", "c_fill", "g_face", "q_100"]),
                        name: data.name,
                        school: data.school,
                        strength_subjects: data.strength_subjects,
                        weak_subjects: data.weak_subjects
                    }))
                }).catch(error => {
                    const errMsg = getErrorMessage(error)
                    console.log(errMsg)
                    navigate("/")
                })

            await PlanService.getMyPlan()
                .then(data => {
                    setPlanInfo(prevState => ({
                        ...prevState,
                        id: data.id,
                        coffeeShop: data.coffeeShop,
                        schedule: data.schedule
                    }))
                }).catch(error => {
                    console.log(error)
                })
        }

        myFunc()
    }, [id])

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

    const handleClickChatIcon = (userId) => {
        ChatService.handleNavigate(userId, navigate)
    }

    return (
        <div className="profile-container">
            <VerticalNav/>
            <div className="profile-section-container">
                <section className="profile-section profile-personal-info-section">
                    <div>
                        <section className="image-container">
                            <img src={profile.imgUrl}/>
                            {isMe ?
                                <button className="primary-button" onClick={() => {
                                    navigate(`/profile-image-creation`)
                                }}>Change image</button> : null}

                        </section>

                        <section className="personal-info">
                            <section className="name-button">
                                <span className="username">{profile.name}</span>
                                {isMe ?
                                    <button className="primary-button" onClick={() => {
                                        navigate(`/profile-info-creation?isEdit=true`)
                                    }}>Edit Info
                                    </button> :
                                    <AiOutlineMessage className="chat-icon" onClick={() => {
                                        handleClickChatIcon(profile.userId)
                                    }}/>
                                }
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
                    {!planInfo.id ? <IoIosAddCircleOutline className="add-plan-icon" onClick={() => {
                            navigate("/plan-creation")
                        }}/> :
                        <>
                            <PlanCard planInfo={planInfo} isOwner={!isMe}/>
                            {isMe ?
                                <div className="buttons">
                                    <button className="primary-button edit-button" onClick={() => {
                                        navigate("/plan-creation")
                                    }}>Edit
                                    </button>
                                    <button className="primary-button delete-button" onClick={handleDelete}>Delete
                                    </button>
                                </div>:null
                            }

                        </>}
                </section>
            </div>
        </div>
    )
}

export default Profile