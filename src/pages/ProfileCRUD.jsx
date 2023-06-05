import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import HomeNav from "../components/HomeNav.jsx";

const ProfileCRUD = () => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState(null)

    const url = new URL(window.location.href);
    let isEdit = url.searchParams.get("isEdit")

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)

        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    const [formData, setFormData] = useState({
        name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        gender_identity: "",
        url: "",
        about: "",
        school: "",
        strengths: []
    })

    let navigate = useNavigate()

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        try {
            const response = await axios.put('http://localhost:8000/user', {formData})
            console.log(response)
            const success = response.status === 200
            if (success) navigate('/dashboard')
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

    const addStrength = (strength) => {
        setFormData((prevState) => {
            if(prevState.strengths.includes(strength)) {
                return {
                    ...prevState,
                    ['strengths']: prevState['strengths'].filter((str) => str !== strength)
                }
            }
            return {
                ...prevState,
                ['strengths']: [...prevState['strengths'], strength]
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
                        <ul className="strength-list">
                            <li className={`${formData.strengths.includes("physics") ? "selected":""}`}
                                onClick={() => {addStrength("physics")}}>
                                Physics
                            </li>
                            <li className={`${formData.strengths.includes("coding") ? "selected":""}`}
                                onClick={() => {addStrength("coding")}}>
                                Coding
                            </li>
                            <li className={`${formData.strengths.includes("math") ? "selected":""}`}
                                onClick={() => {addStrength("math")}}>
                                Math
                            </li>

                            <li className={`${formData.strengths.includes("chemistry") ? "selected":""}`}
                                onClick={() => {addStrength("chemistry")}}>
                                Chemistry
                            </li>

                            <li className={`${formData.strengths.includes("biology") ? "selected":""}`}
                                onClick={() => {addStrength("biology")}}>
                                Biology
                            </li>

                            <li className={`${formData.strengths.includes("english") ? "selected":""}`}
                                onClick={() => {addStrength("english")}}>
                                English
                            </li>

                            <li className={`${formData.strengths.includes("literature") ? "selected":""}`}
                                onClick={() => {addStrength("literature")}}>
                                Literature
                            </li>

                            <li className={`${formData.strengths.includes("french") ? "selected":""}`}
                                onClick={() => {addStrength("french")}}>
                                French
                            </li>

                            <li className={`${formData.strengths.includes("marketing") ? "selected":""}`}
                                onClick={() => {addStrength("marketing")}}>
                                Marketing
                            </li>

                            <li className={`${formData.strengths.includes("finance") ? "selected":""}`}
                                onClick={() => {addStrength("finance")}}>
                                Finance
                            </li>

                        </ul>

                        <label htmlFor="url">Profile Photo</label>
                        <input id="url" type='file' onChange={onSelectFile} />
                        <div className="photo-container">
                            {selectedFile &&  <img src={preview} /> }
                        </div>
                    </section>

                </form>
            </div>
        </>
    )
}
export default ProfileCRUD