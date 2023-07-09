import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js"
import UserService from "../api/services/user.service.js";
// import {SlPencil} from "react-icons/sl";

const ProfileCRUD = () => {
    const url = new URL(window.location.href);
    let isEdit = url.searchParams.get("isEdit") === 'true'
    const [placeHolder, setPlaceHolder] = useState({
        name: "Name",
        dob_day: "DD",
        dob_month: "MM",
        dob_year: "YYYY",
        about: "I love study at coffee shop",
        school: "School"
    })
    const subjects = [
        "Vật lý",
        "Tiếng anh",
        "Ielts",
        "Tin học",
        "Văn",
        "Toán",
        "Hóa",
        "Sinh",
        "Sử",
        "Địa",
        "Tiếng Pháp",
        "Marketing",
        "Tài chính"
    ]

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        about: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    const [isClickName, setIsClickName] = useState(false)

    const [isClickDob, setIsClickDob] = useState(false)

    const [isClickGender, setIsClickGender] = useState(false)

    const [isClickAbout, setIsClickAbout] = useState(false)

    const [isClickSchool, setIsClickSchool] = useState(false)

    const [oldProfile, setOldprofile] = useState(null)

    let navigate = useNavigate()

    useEffect(() => {
        if (isEdit) {
            ProfileService.getMyProfile()
                .then(data => {
                    setPlaceHolder(data)
                    setOldprofile(data)
                })
                .catch(error => {
                    console.log(getErrorMessage(error))
                    navigate("/profile-info-creation?isEdit=false")
                })
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()


        if (isEdit) {
            UserService.getCurrentUser()
                .then(user => {
                    if (user.profileId === null) {
                        navigate("/profile-info-creation?isEdit=false")
                    } else {
                        ProfileService.editProfileInfo(user.profileId, formData)
                            .then(response => {
                                navigate("/profile/" + user.profileId)
                            })
                            .catch(error => {
                                const errorMsg = getErrorMessage(error)
                                navigate("/profile/" + user.profileId)
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                    localStorage.clear()
                    navigate("/")
                })
        } else {
            UserService.getCurrentUser()
                .then(user => {
                    if (user.profileId) {
                        navigate("/profile/" + user.profileId)
                    } else {
                        ProfileService.uploadProfileInfo(formData)
                            .then(
                                response => {
                                    navigate("/profile-image-creation")
                                },
                                error => {
                                    const resMessage = getErrorMessage(error)
                                    navigate("/profile-info-creation?isEdit=false")
                                }
                            )
                    }
                })
                .catch(error => {
                    localStorage.clear()
                    navigate("/")
                })

        }

    }

    const handleChange = (e) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        let name = e.target.name

        setFormData((prevState) => {
            if (name === 'strengths') {
                return {
                    ...prevState,
                    [name]: [...prevState[name], value]
                }
            } else {
                return {
                    ...prevState,
                    [name]: value
                }


            }
        })
    }

    const addStrengthOrWeakness = (field, value) => {
        setFormData((prevState) => {
            if (prevState[field].includes(value)) {
                return {
                    ...prevState,
                    [field]: prevState[field].filter((str) => str !== value)
                }
            }
            return {
                ...prevState,
                [field]: [...prevState[field], value]
            }
        })
    }

    return (
        <div className="onboarding-container">
            <HomeNav/>
            <div className="onboarding">
                {isEdit ? (<h2>CHỈNH SỬA PROFILE</h2>) : <h2>TẠO PROFILE</h2>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <section>
                            <label htmlFor="name">Tên</label>
                            <span>
                                {
                                    oldProfile && !isClickName ?
                                        <article>
                                            <span className="text">
                                                {oldProfile.name}
                                                {/*<SlPencil className="edit-icon" onClick={() => {*/}
                                                {/*    setIsClickName(true)*/}
                                                {/*}}/>*/}
                                            </span>
                                        </article> :

                                        <input
                                            id="name"
                                            type='text'
                                            name="name"
                                            placeholder={placeHolder.name}
                                            required={true}
                                            value={formData.name}
                                            onChange={handleChange}/>
                                }
                            </span>

                            {/* TODO: change backend dto */}

                            <label htmlFor="dob">Ngày sinh</label>
                            <div className="multiple-input-container">
                                <span>
                                    {
                                        oldProfile && !isClickDob ?
                                            <article>
                                            <span className="text">
                                                {oldProfile.dob}
                                                {/*<SlPencil className="edit-icon" onClick={() => {*/}
                                                {/*    setIsClickDob(true)*/}
                                                {/*}}/>*/}
                                            </span>
                                            </article> :
                                            <input
                                                id="dob"
                                                type="date"
                                                name="dob"
                                                required={true}
                                                value={formData.dob}
                                                onChange={handleChange}
                                            />
                                    }
                                </span>
                            </div>

                            <label>Giới tính</label>
                            <span>
                                {
                                    oldProfile && !isClickGender ?
                                        <article>
                                            <span className="text">
                                                {oldProfile.gender}
                                                {/*<SlPencil className="edit-icon" onClick={() => {*/}
                                                {/*    setIsClickGender(true)*/}
                                                {/*}}/>*/}
                                            </span>
                                        </article> :
                                        <div className="multiple-input-container">
                                            <input
                                                id="man-gender-identity"
                                                type="radio"
                                                name="gender"
                                                value="man"
                                                onChange={handleChange}
                                                checked={formData.gender === "man"}
                                            />
                                            <label htmlFor="man-gender-identity">Nam</label>
                                            <input
                                                id="woman-gender-identity"
                                                type="radio"
                                                name="gender"
                                                value="woman"
                                                onChange={handleChange}
                                                checked={formData.gender === "woman"}
                                            />
                                            <label htmlFor="woman-gender-identity">Nữ</label>
                                            <input
                                                id="more-gender-identity"
                                                type="radio"
                                                name="gender"
                                                value="more"
                                                onChange={handleChange}
                                                checked={formData.gender === "more"}
                                            />
                                            <label htmlFor="more-gender-identity">Khác</label>
                                        </div>
                                }
                            </span>
                            <label htmlFor="about">Giới Thiệu</label>
                            <span>
                                {
                                    oldProfile && !isClickAbout ?
                                        <article>
                                            <span className="text">
                                                {oldProfile.about}
                                                {/*<SlPencil className="edit-icon" onClick={() => {*/}
                                                {/*    setIsClickAbout(true)*/}
                                                {/*}}/>*/}
                                            </span>
                                        </article> :
                                        <input
                                            id="about"
                                            type="text"
                                            name="about"
                                            required={true}
                                            placeholder={placeHolder.about}
                                            value={formData.about}
                                            onChange={handleChange}
                                        />
                                }
                            </span>
                            {/*<input type="submit"/>*/}
                        </section>

                        <section>
                            <label htmlFor="school">Học tại</label>
                            <span>
                                {
                                    oldProfile && !isClickSchool ?
                                        <article>
                                            <span className="text">
                                                {oldProfile.school}
                                                {/*<SlPencil className="edit-icon" onClick={() => {*/}
                                                {/*    setIsClickSchool(true)*/}
                                                {/*}}/>*/}
                                            </span>
                                        </article> :
                                        <input
                                            id="school"
                                            type="text"
                                            name="school"
                                            required={true}
                                            placeholder={placeHolder.school}
                                            value={formData.school}
                                            onChange={handleChange}
                                        />
                                }
                            </span>

                            <label>Thế mạnh</label>
                            <ul>
                                {subjects.map((value, index) => {
                                    return <li key={index}
                                               className={`${formData.strength_subjects.includes(value) ? "selected" : ""}`}
                                               onClick={() => {
                                                   addStrengthOrWeakness("strength_subjects", value)
                                               }}>
                                        {value}
                                    </li>
                                })}
                            </ul>

                            <label>Cần người kèm</label>
                            <ul>
                                {subjects.map((value, index) => {
                                    return <li key={index}
                                               className={`${formData.weak_subjects.includes(value) ? "selected" : ""}`}
                                               onClick={() => {
                                                   addStrengthOrWeakness("weak_subjects", value)
                                               }}>
                                        {value}
                                    </li>
                                })}
                            </ul>

                        </section>
                    </div>
                    {/*<input type="submit"/>*/}
                    <button className="primary-button" onClick={handleSubmit}>Lưu</button>
                </form>
            </div>
        </div>
    )
}
export default ProfileCRUD