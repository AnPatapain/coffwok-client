import HomeNav from "../components/HomeNav.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {useEffect, useState} from "react";
import {ACCESS_TOKEN} from "../api/constant/index.js";
import {useNavigate} from "react-router-dom";
import UserService from "../api/services/user.service.js";
import ProfileService from "../api/services/profile.service.js";

const Home = () => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [isSignup, setIsSignup] = useState(true)

    useEffect(() => {
        UserService.getCurrentUser()
            .then(user => {
                if(user) {
                    if(user.profileId === null) {
                        navigate("/profile-info-creation?isEdit=false")
                    }else {
                        ProfileService.getMyProfile()
                            .then(data => {
                                if(data.imgUrl === null) {
                                    navigate("/profile-image-creation")
                                }else {
                                    navigate("/dashboard")
                                }
                            })
                            .catch(error => {
                                localStorage.clear()
                                navigate("/")
                            })
                    }
                }else {
                    localStorage.clear()
                    navigate("/")
                }
            })
            .catch(error => {
                console.log(error)
                localStorage.clear()
                navigate("/")
            })
    }, [])

    const handleSignupClick = () => {
        setShowModal(true)
        setIsSignup(true)
    }

    const handleLoginClick = () => {
        setShowModal(true)
        setIsSignup(false)
    }

    return (
        <div className="overlay">
            <HomeNav/>
            <div className="home">
                <h1 className="primary-title">Swipe Right to Study together at Café</h1>
                <article>
                    <p>share next study plan at your favorite café, find study partner, connect and study together.</p>
                    <p>The best place for sapiosexuals</p>
                </article>
                <div className="home-buttons">
                    <button className="primary-button" onClick={handleSignupClick}>create account</button>
                    <button className="primary-button transparent-button" onClick={handleLoginClick}>log in</button>
                </div>

                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignup={isSignup} setIsSignup={setIsSignup}/>
                )}
            </div>
        </div>
    )
}

export default Home