import VerticalNav from "../components/VerticalNav.jsx";

import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ProfileService from "../api/services/profile.service.js";
import ImageService from "../api/services/image.service.js";
import PlanCard from "../components/PlanCard.jsx";
import PlanService from "../api/services/plan.service.js";
import {PROFILE_ID} from "../api/constant/index.js";
import ChatService from "../api/services/chat.service.js";

import add_icon from "../assets/icons/add-icon.svg"
import school_icon from "../assets/icons/school-icon.svg"
import sos_icon from "../assets/icons/sos.png"
import good_icon from "../assets/icons/good.png"
import UserService from "../api/services/user.service.js";


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
        planDetails: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    useEffect(() => {
        async function myFunc() {
            await ProfileService.getProfileById(id)
                .then(data => {
                    setProfile(data)
                    setPlanInfo(prevState => ({
                        ...prevState,
                        imgUrl: ImageService.modifyImageURI(data.imgUrl, ["w_50", "h_50", "c_fill", "g_face", "q_100"]),
                        name: data.name,
                        school: data.school,
                        strength_subjects: data.strength_subjects,
                        weak_subjects: data.weak_subjects
                    }))
                    UserService.getUserById(data.userId)
                        .then(userData => {
                            PlanService.getPlanById(userData.planId)
                                .then(planData => {
                                    setPlanInfo(prevState => ({
                                        ...prevState,
                                        id: planData.id,
                                        coffeeShop: planData.coffeeShop,
                                        schedule: planData.schedule,
                                        planDetails: planData.planDetails
                                    }))
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        })
                        .catch(error => {
                            localStorage.clear()
                            navigate("/")
                        })
                }).catch(error => {
                    localStorage.clear()
                    navigate("/")
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
                navigate("/dashboard")
            })
    }

    const handleClickChatIcon = (userId) => {
        ChatService.handleNavigate(userId, navigate)
    }

    return (
        <div className="profile-container">
            <VerticalNav selectedItem={"profile"}/>
            <div className="profile-section-container">
                <section className="profile-section profile-personal-info-section">
                    <div>
                        <section className="image-container">
                            <img src={profile.imgUrl}/>
                            {isMe ?
                                <button className="primary-button" onClick={() => {
                                    navigate(`/profile-image-creation?isEdit=true`)
                                }}>Change image</button> : null}
                        </section>

                        <section className="personal-info">
                            <section className="name-button">
                                <span className="username">{profile.name}</span>
                                {isMe ?
                                    <button className="primary-button" onClick={() => {
                                        navigate(`/profile-info-creation?isEdit=true`)
                                    }}>Edit Profile
                                    </button> :
                                    <span className="message-button" onClick={() => {
                                        handleClickChatIcon(profile.userId)
                                    }}>
                                        Invite to Café
                                    </span>
                                }
                            </section>
                            <p className="about">{profile.about}</p>
                        </section>
                    </div>
                </section>

                <section className="profile-section profile-study-info-section">
                    <article>
                        <span className="category"><img src={school_icon} className="study-info-icon"/> School</span>
                        <span>{profile.school}</span>
                    </article>
                    <article>
                        <span className="category"><img src={good_icon} className="study-info-icon"/> Strength</span>
                        <span>{profile.strength_subjects.join(", ")}</span>
                    </article>
                    <article>
                        {/*<span className="category"><AiOutlineDislike className="study-info-icon"/> Điểm yếu</span>*/}
                        <span className="category"><img src={sos_icon}
                                                        className="study-info-icon"/> Need study partner in</span>
                        <span>{profile.weak_subjects.join(", ")}</span>
                    </article>
                </section>

                <section className="profile-section profile-coffee-study-plan-section">
                    {!planInfo.id ? <h2>Tạo kế hoạch Cà phê - Học bài</h2> : <h2>Coffee-Study Plan</h2>}
                    {!planInfo.id ? <img src={add_icon} className="add-plan-icon" onClick={() => {
                            navigate("/plan-creation")
                        }}/> :
                        <>
                            <PlanCard planInfo={planInfo} isOwner={isMe} isShowButton={false}/>
                            {isMe ?
                                <div className="buttons">
                                    <button className="primary-button edit-button" onClick={() => {
                                        navigate("/plan-creation")
                                    }}>Edit
                                    </button>
                                    <button className="primary-button delete-button" onClick={handleDelete}>Delete
                                    </button>
                                </div> : null
                            }

                        </>}
                </section>
            </div>
        </div>
    )
}

export default Profile