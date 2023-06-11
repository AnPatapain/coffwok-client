import HomeNav from "../components/HomeNav.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {useEffect, useState} from "react";
import {ACCESS_TOKEN} from "../api/constant/index.js";
import {useNavigate} from "react-router-dom";
import UserService from "../api/services/user.service.js";

const Home = () => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [isSignup, setIsSignup] = useState(true)

    useEffect(() => {
        UserService.getCurrentUser()
            .then(user => {
                if(user.profileId === null) {
                    navigate("/profile-info-creation?isEdit=false")
                }else {
                    navigate("/plans")
                }
            })
            .catch(error => {
                console.log(error)
                if(localStorage.getItem(ACCESS_TOKEN)) {
                    localStorage.removeItem(ACCESS_TOKEN)
                }
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
                <h1 className="primary-title">Hey, you love connecting and studying with other student at café ?</h1>
                <h2 className="secondary-title">share a plan, connect and study together</h2>
                <h2 className="secondary-title">The best place for Sapiosexuals</h2>
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