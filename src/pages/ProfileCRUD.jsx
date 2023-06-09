import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import LocalStorageService from "../api/services/localStorage.service.js";

const ProfileCRUD = () => {
    const url = new URL(window.location.href);
    let isEdit = url.searchParams.get("isEdit") === 'true'

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
            ProfileService.uploadProfileInfo(formData)
                .then(
                    response => {
                        console.log(response)
                        LocalStorageService.add("profileId", response.data.id)
                        navigate("/profile-image-creation")
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
        <>
            <HomeNav/>
            <div className="onboarding">
                {isEdit ? (<h2>EDIT PROFILE</h2>) : <h2>CREATE PROFILE</h2>}

                <form onSubmit={handleSubmit}>
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
                            <label htmlFor="more-gender-identity">More</label>
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
                        <input type="submit"/>
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
                            <li className={`${formData.strength_subjects.includes("physics") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "physics")}}>
                                Physics
                            </li>
                            <li className={`${formData.strength_subjects.includes("coding") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "coding")}}>
                                Coding
                            </li>
                            <li className={`${formData.strength_subjects.includes("math") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "math")}}>
                                Math
                            </li>

                            <li className={`${formData.strength_subjects.includes("chemistry") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "chemistry")}}>
                                Chemistry
                            </li>

                            <li className={`${formData.strength_subjects.includes("biology") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "biology")}}>
                                Biology
                            </li>

                            <li className={`${formData.strength_subjects.includes("english") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "english")}}>
                                English
                            </li>

                            <li className={`${formData.strength_subjects.includes("literature") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "literature")}}>
                                Literature
                            </li>

                            <li className={`${formData.strength_subjects.includes("french") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "french")}}>
                                French
                            </li>

                            <li className={`${formData.strength_subjects.includes("marketing") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "marketing")}}>
                                Marketing
                            </li>

                            <li className={`${formData.strength_subjects.includes("finance") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("strength_subjects", "finance")}}>
                                Finance
                            </li>

                        </ul>

                        <label>Weakness</label>
                        <ul>
                            <li className={`${formData.weak_subjects.includes("physics") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "physics")}}>
                                Physics
                            </li>
                            <li className={`${formData.weak_subjects.includes("coding") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "coding")}}>
                                Coding
                            </li>
                            <li className={`${formData.weak_subjects.includes("math") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "math")}}>
                                Math
                            </li>

                            <li className={`${formData.weak_subjects.includes("chemistry") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "chemistry")}}>
                                Chemistry
                            </li>

                            <li className={`${formData.weak_subjects.includes("biology") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "biology")}}>
                                Biology
                            </li>

                            <li className={`${formData.weak_subjects.includes("english") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "english")}}>
                                English
                            </li>

                            <li className={`${formData.weak_subjects.includes("literature") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "literature")}}>
                                Literature
                            </li>

                            <li className={`${formData.weak_subjects.includes("french") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "french")}}>
                                French
                            </li>

                            <li className={`${formData.weak_subjects.includes("marketing") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "marketing")}}>
                                Marketing
                            </li>

                            <li className={`${formData.weak_subjects.includes("finance") ? "selected":""}`}
                                onClick={() => {addStrengthOrWeakness("weak_subjects", "finance")}}>
                                Finance
                            </li>

                        </ul>

                    </section>

                </form>
            </div>
        </>
    )
}
export default ProfileCRUD