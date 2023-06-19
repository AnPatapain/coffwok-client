import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js"
import UserService from "../api/services/user.service.js";
import {ACCESS_TOKEN} from "../api/constant/index.js";
import VerticalNav from "../components/VerticalNav.jsx";

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
        "physic",
        "english",
        "ielts",
        "coding",
        "literature",
        "math",
        "chemistry",
        "biology",
        "history",
        "geography",
        "french",
        "marketing",
        "finance"
    ]

    const [formData, setFormData] = useState({
        name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        gender: "",
        url: "",
        about: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    let navigate = useNavigate()

    useEffect(() => {
        if(isEdit) {
            ProfileService.getMyProfile()
                .then(data => {
                    setPlaceHolder(data)
                })
                .catch(error => {
                    console.log(getErrorMessage(error))
                })
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log("before sending ", formData)
            if(isEdit) {
                UserService.getCurrentUser()
                    .then(user => {
                        if(user.profileId === null) {
                            navigate("/profile-info-creation?isEdit=false")
                        }else {
                            ProfileService.editProfileInfo(user.profileId, formData)
                                .then(response => {
                                    console.log("sent ", response.data)
                                    navigate("/profile")
                                })
                                .catch(error => {
                                    const errorMsg = getErrorMessage(error)
                                    console.log(errorMsg)
                                    navigate("/profile")
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if(localStorage.getItem(ACCESS_TOKEN)) {
                            localStorage.removeItem(ACCESS_TOKEN)
                        }
                        navigate("/")
                    })
            }else {
                UserService.getCurrentUser()
                    .then(user => {
                        if(user.profileId) {
                            console.log("user has already profile")
                            navigate("/profile")
                        }else {
                            ProfileService.uploadProfileInfo(formData)
                                .then(
                                    response => {
                                        console.log(response.data)
                                        navigate("/profile-image-creation")
                                    },
                                    error => {
                                        const resMessage = getErrorMessage(error)
                                        console.log(resMessage)
                                    }
                                )
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if(localStorage.getItem(ACCESS_TOKEN)) {
                            localStorage.removeItem(ACCESS_TOKEN)
                        }
                        navigate("/")
                    })

            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        let name = e.target.name

        setFormData((prevState) => {
            if(name === 'strengths') {
                return {
                    ...prevState,
                    [name]: [...prevState[name], value]
                }
            }else {
                return {
                    ...prevState,
                    [name]: value
                }
            }
        })
    }

    const addStrengthOrWeakness = (field, value) => {
        setFormData((prevState) => {
            if(prevState[field].includes(value)) {
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
                {isEdit ? (<h2>EDIT PROFILE</h2>) : <h2>CREATE PROFILE</h2>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <section>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type='text'
                                name="name"
                                placeholder={placeHolder.name}
                                required={true}
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <label>Birthday</label>
                            <div className="multiple-input-container">
                                <input
                                    id="dob_day"
                                    type="number"
                                    name="dob_day"
                                    placeholder={placeHolder.dob_day}
                                    required={true}
                                    value={formData.dob_day}
                                    onChange={handleChange}
                                />

                                <input
                                    id="dob_month"
                                    type="number"
                                    name="dob_month"
                                    placeholder={placeHolder.dob_month}
                                    required={true}
                                    value={formData.dob_month}
                                    onChange={handleChange}
                                />

                                <input
                                    id="dob_year"
                                    type="number"
                                    name="dob_year"
                                    placeholder={placeHolder.dob_year}
                                    required={true}
                                    value={formData.dob_year}
                                    onChange={handleChange}
                                />
                            </div>

                            <label>Gender</label>
                            <div className="multiple-input-container">
                                <input
                                    id="man-gender-identity"
                                    type="radio"
                                    name="gender"
                                    value="man"
                                    onChange={handleChange}
                                    checked={formData.gender === "man"}
                                />
                                <label htmlFor="man-gender-identity">Man</label>
                                <input
                                    id="woman-gender-identity"
                                    type="radio"
                                    name="gender"
                                    value="woman"
                                    onChange={handleChange}
                                    checked={formData.gender === "woman"}
                                />
                                <label htmlFor="woman-gender-identity">Woman</label>
                                <input
                                    id="more-gender-identity"
                                    type="radio"
                                    name="gender"
                                    value="more"
                                    onChange={handleChange}
                                    checked={formData.gender === "more"}
                                />
                                <label htmlFor="more-gender-identity">Other</label>
                            </div>

                            <label htmlFor="about">About me</label>
                            <input
                                id="about"
                                type="text"
                                name="about"
                                required={true}
                                placeholder={placeHolder.about}
                                value={formData.about}
                                onChange={handleChange}
                            />
                            {/*<input type="submit"/>*/}
                        </section>

                        <section>
                            <label htmlFor="school">School</label>
                            <input
                                id="school"
                                type="text"
                                name="school"
                                required={true}
                                placeholder={placeHolder.school}
                                value={formData.school}
                                onChange={handleChange}
                            />

                            <label>Strengths</label>
                            <ul>
                                {subjects.map((value, index) => {
                                    return <li key={index} className={`${formData.strength_subjects.includes(value) ? "selected":""}`}
                                               onClick={() => {addStrengthOrWeakness("strength_subjects", value)}}>
                                        {value}
                                    </li>
                                })}
                            </ul>

                            <label>Weakness</label>
                            <ul>
                                {subjects.map((value, index) => {
                                    return <li key={index} className={`${formData.weak_subjects.includes(value) ? "selected":""}`}
                                               onClick={() => {addStrengthOrWeakness("weak_subjects", value)}}>
                                        {value}
                                    </li>
                                })}
                            </ul>

                        </section>
                    </div>
                    <input type="submit"/>
                </form>
            </div>
        </div>
    )
}
export default ProfileCRUD