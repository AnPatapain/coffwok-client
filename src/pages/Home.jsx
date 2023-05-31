import Nav from "../components/Nav.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {useState} from "react";

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignup, setIsSignup] = useState(true)

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
            <Nav/>
            <div className="home">
                <h1 className="primary-title">Study together at Glife</h1>
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