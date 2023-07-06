import {useEffect, useState} from "react";
import AuthService from "../api/services/auth.service.js";
import coffwokLogo from "../assets/coffwok-logo.png";
import googleLogo from "../assets/google-logo.png"
import {GOOGLE_AUTH_URL} from "../api/constant/index.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";

// eslint-disable-next-line react/prop-types
const AuthModal = ({setShowModal, isSignup, setIsSignup}) => {
    const navigate = useNavigate()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        password !== confirmPassword ? setError("Error: Password do not match") : setError("")
    }, [email, password, confirmPassword])

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
                    console.log(error)
                    const resMessage = getErrorMessage(error)
                    setError(resMessage)
                }
            )
        }else {
            //If the modal show the login form
            AuthService.login(email, password).then(
                (data) => {
                    navigate("/localAuth/redirect", {
                        state: {data}
                    })
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
            <h2>{isSignup ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'}</h2>
            <div className="google-button">
                <a href={GOOGLE_AUTH_URL}>
                    <button className="google-button-style">
                        {isSignup ? 'Tạo tài khoản bằng Google' : 'Đăng nhập bằng Google'}
                        <img src={googleLogo} alt="Google Logo" className="google-logo" />
                    </button>
                </a>
            </div>
            <div className="divider">
                <div className="line-1"></div>
                <p>Hoặc</p>
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
                    placeholder="Mật khẩu"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignup && (<input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="Nhập lại mật khẩu"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />)}

                <button className="primary-button">{isSignup ? 'TIẾP TỤC' : 'ĐĂNG NHẬP'}</button>
                {isSignup && (<p className="auth-match-password-error">{error}</p>)}
                {!isSignup && (<p className="auth-message-success">{message}</p>)}
            </form>
        </div>
    )
}
export default AuthModal;