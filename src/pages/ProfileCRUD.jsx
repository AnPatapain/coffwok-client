import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {getErrorMessage} from "../api/error/errorMessage.js"
import UserService from "../api/services/user.service.js";
import {ACCESS_TOKEN} from "../api/constant/index.js";

const ProfileCRUD = () => {
    const url = new URL(window.location.href);
    let isEdit = url.searchParams.get("isEdit") === 'true'
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
        gender_identity: "",
        url: "",
        about: "",
        school: "",
        strength_subjects: [],
        weak_subjects: []
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            if(isEdit) {
                UserService.getCurrentUser()
                    .then(user => {
                        if(user.profileId === null) {
                            navigate("/profile-info-creation?isEdit=false")
                        }else {
                            ProfileService.editProfileInfo(user.profileId, formData)
                                .then(response => {
                                    console.log(response.data)
                                    navigate("/profile")
                                })
                                .catch(error => {
                                    const errorMsg = getErrorMessage(error)
                                    console.log(errorMsg)
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

    console.log(formData)

    return (
        <>
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
                                placeholder="Name"
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
                                    placeholder="DD"
                                    required={true}
                                    value={formData.dob_day}
                                    onChange={handleChange}
                                />

                                <input
                                    id="dob_month"
                                    type="number"
                                    name="dob_month"
                                    placeholder="MM"
                                    required={true}
                                    value={formData.dob_month}
                                    onChange={handleChange}
                                />

                                <input
                                    id="dob_year"
                                    type="number"
                                    name="dob_year"
                                    placeholder="YYYY"
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
                                    name="gender_identity"
                                    value="man"
                                    onChange={handleChange}
                                    checked={formData.gender_identity === "man"}
                                />
                                <label htmlFor="man-gender-identity">Man</label>
                                <input
                                    id="woman-gender-identity"
                                    type="radio"
                                    name="gender_identity"
                                    value="woman"
                                    onChange={handleChange}
                                    checked={formData.gender_identity === "woman"}
                                />
                                <label htmlFor="woman-gender-identity">Woman</label>
                                <input
                                    id="more-gender-identity"
                                    type="radio"
                                    name="gender_identity"
                                    value="more"
                                    onChange={handleChange}
                                    checked={formData.gender_identity === "more"}
                                />
                                <label htmlFor="more-gender-identity">Other</label>
                            </div>

                            <label htmlFor="about">About me</label>
                            <input
                                id="about"
                                type="text"
                                name="about"
                                required={true}
                                placeholder="I love study at coffee shop ..."
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
                                placeholder="school"
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
        </>
    )
}
export default ProfileCRUD