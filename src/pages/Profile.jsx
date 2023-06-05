import test_profile_img from "../assets/test/test-profile-img.jpg"
import VerticalNav from "../components/VerticalNav.jsx";

import {TbSchool} from "react-icons/tb"
import {AiOutlineLike} from "react-icons/ai"
import {AiOutlineDislike} from "react-icons/ai"
import {AiOutlineMessage} from "react-icons/ai";
import {AiOutlineHeart} from "react-icons/ai"
import {useNavigate} from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate()
    const isUser = true
    return (
        <div className="profile-container">
            <VerticalNav />
            <div className="profile-section-container">
                <section className="profile-section profile-personal-info-section">
                    <div>
                        <img src={test_profile_img}/>
                        <section className="personal-info">
                            <section className="name-button">
                                <span className="username">NGUYEN An, 22</span>
                                {isUser && (<button className="primary-button" onClick={() => {navigate(`/profile-creation?isEdit=true`)}}>Edit profile</button>)}
                            </section>
                            <p className="about">I love coding at coffee shop and networking with peopleeeeeeeee
                            </p>
                            <section className="profile-sub-info">
                                {isUser ? (<article><span>130 visited</span><span>10 love</span></article>) :
                                    (<article>
                                        <span><AiOutlineMessage className="icon"/> Invite to Glife</span>
                                        <span><AiOutlineHeart className="icon"/> Like</span>
                                    </article>)}
                            </section>
                        </section>
                    </div>
                </section>

                <section className="profile-section profile-study-info-section">
                    <article>
                        <span className="category"><TbSchool className="study-info-icon"/> School</span>
                        <span>Le Quy Don</span>
                    </article>
                    <article>
                        <span className="category"><AiOutlineLike className="study-info-icon"/> My strengths</span>
                        <span>Physics, Coding, French, Math</span>
                    </article>
                    <article>
                        <span className="category"><AiOutlineDislike className="study-info-icon"/> My weakness</span>
                        <span>English, Chemistry, Biology</span>
                    </article>
                </section>
                <section className="profile-section profile-coffee-study-plan-section">
                    TODO: profile coffee study plan
                </section>
            </div>
        </div>
    )
}

export default Profile