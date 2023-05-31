import {useEffect, useState} from "react";
import AuthService from "../api/services/auth.service.js";
import coffwokLogo from "../assets/coffwok-logo.png";
import googleLogo from "../assets/google-logo.png"

// eslint-disable-next-line react/prop-types
const AuthModal = ({setShowModal, isSignup, setIsSignup}) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        password !== confirmPassword ? setError("Error: Password do not match") : setError("")
    }, [email, password, confirmPassword])

    console.log(email, password, confirmPassword)
    const handleClick = () => {
        setShowModal(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if(isSignup) {
            //If the modal show the signup form
            AuthService.register(email, password).then(
                response => {
                    console.log(response)
                    setIsSignup(false)
                    setMessage("Register successfully, please login")
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(resMessage)
                }
            )
        }else {
            //If the modal show the login form
            AuthService.login(email, password).then(
                (data) => {
                    console.log("success")
                    console.log(data)

                    /**
                     * TODO: redirect user the newfeed plan page if login success
                     *       for now just close the modal.
                     */
                    setShowModal(false)
                },
                (error) => {
                    console.log("error", error)
                }
            )
        }
    }


    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>
                &#10006;
            </div>
            <div className="logo-container">
                <img className="logo" src={coffwokLogo}/>
            </div>
            <h2>{isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}</h2>
            <div className="google-button">
                <button className="google-button-style">
                    Continue with Google
                    <img src={googleLogo} alt="Google Logo" className="google-logo" />
                </button>
            </div>
            <div className="divider">
                <div className="line-1"></div>
                <p>or</p>
                <div className="line-2"></div>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignup && (<input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />)}

                <button className="primary-button">Submit</button>
                {isSignup && (<p className="auth-match-password-error">{error}</p>)}
                {!isSignup && (<p className="auth-message-success">{message}</p>)}
            </form>
        </div>
    )
}
export default AuthModal;