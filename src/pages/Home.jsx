import HomeNav from "../components/HomeNav.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../api/services/user.service.js";
import ProfileService from "../api/services/profile.service.js";
import {Helmet} from "react-helmet-async";

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
            <Helmet>
                <title>Coffwok | Tìm bạn đi cafe-học bài tại Quy Nhơn</title>
                <meta name="description" content="Bạn sống ở Quy Nhơn và yêu thích học bài tại quán Cà phê? Đừng đi một mình : ) Tìm bạn đi cà phê học bài chung ngay hôm nay. Tạo mối quan hệ, cùng nhau học các môn bạn yêu thích tại các quán Cà phê như: Glife, E-coffee, ..." />
            </Helmet>
            <HomeNav/>
            <div className="home">
                <h1 className="primary-title">Tìm bạn học bài chung tại Glife</h1>
                <article>
                    <p>Xem các kế hoạch đi Cà phê Học bài, kết nối và đi Glife học bài chung</p>
                </article>
                <div className="home-buttons">
                    <button className="primary-button" onClick={handleSignupClick}>Tạo tài khoản</button>
                    <button className="primary-button transparent-button" onClick={handleLoginClick}>Đăng nhập</button>
                </div>

                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignup={isSignup} setIsSignup={setIsSignup}/>
                )}
            </div>
        </div>
    )
}

export default Home