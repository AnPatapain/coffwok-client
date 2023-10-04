import ImageService from "../api/services/image.service.js";
import UserService from "../api/services/user.service.js";
import {useNavigate} from "react-router-dom";
import ChatService from "../api/services/chat.service.js";

import school_icon from "../assets/icons/school-icon.svg"
import sos_icon from "../assets/icons/sos.png"
import study_icon from "../assets/icons/study-icon.svg";

// eslint-disable-next-line react/prop-types
const ProfileCard = ({profile, isOwner, isShowButton}) => {
    const navigate = useNavigate()
    const navigateToProfile = (userId) => {
        UserService.getUserById(userId)
            .then(data => {
                navigate("/profile/" + data.profileId)
            })
            .catch(error => {
                console.log(error)
                alert("Create account to see other's profile")
            })
    }

    const handleClickChatIcon = (userId) => {
        ChatService.handleNavigate(userId, navigate)
    }
    return (
        <div className="plan-card">
            <section className="name-button-section">
                {/* eslint-disable-next-line react/prop-types */}
                {profile.imgUrl !== null ?
                    <img className="small-profile-image"
                         src={ImageService.modifyImageURI(profile.imgUrl, ["w_50", "h_50", "c_fill", "g_face", "q_100"])}
                         onClick={() => navigateToProfile(profile.userId)} alt="profileImage"/> : null}

                <div className="name-button-about">
                    <article>
                        <p onClick={() => {
                            navigateToProfile(profile.userId)
                        }} className="name">
                            {profile.name}
                        </p>

                        <p onClick={() => {
                            navigateToProfile(profile.userId)
                        }} className="about about-mobile">
                            {profile.about && profile.about.length > 66 ? profile.about.substring(0, 66) + "..." : profile.about}
                        </p>

                        {
                            !isOwner && isShowButton ?
                                <span className="message-button" onClick={() => {
                                    handleClickChatIcon(profile.userId)
                                }}>
                            Invite to café
                        </span> : ""
                        }
                        {isShowButton ?
                            <span className="message-button" onClick={() => navigateToProfile(profile.userId)}>View Profile</span> : null}
                    </article>
                    <article className="about-container">
                        <p className="about" onClick={() => {
                            navigateToProfile(profile.userId)
                        }}>
                            {profile.about && profile.about.length > 66 ? profile.about.substring(0, 66) + "..." : profile.about}
                        </p>
                    </article>
                </div>

            </section>
            <ul className="plan-info-section">
                <li className="plan-info-item">
                    <article className="category">
                        <img src={school_icon} className="icon"/>
                        <span>School</span>
                    </article>
                    <span className="text">{profile.school}</span>
                </li>
                <li className="plan-info-item">
                    <article className="category">
                        <img src={study_icon} className="icon"/>
                        <span>Find study partner in</span>
                    </article>
                    <span className="text">{profile.weak_subjects.join(", ")}</span>
                </li>
            </ul>
        </div>
    )
}

export default ProfileCard