import {useEffect, useState} from "react";
import profile_img_1 from "../assets/profile-img-1.png"
import profile_img_2 from "../assets/profile-img-2.png"
import {BiImageAdd} from "react-icons/bi"
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import UserService from "../api/services/user.service.js";
import {ACCESS_TOKEN} from "../api/constant/index.js";

const ProfileImageCRUD = () => {
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState(null)

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

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }

    const handleClick = () => {
        if(selectedFile && preview) {
            setSelectedFile(undefined)
            setPreview(null)
        }
    }

    const handleSubmit = () => {
        UserService.getCurrentUser()
            .then(user => {
                if(user.profileId === null) {
                    navigate("/profile-info-creation?isEdit=false")
                }else {
                    ProfileService.uploadProfileImage(user.profileId, selectedFile)
                        .then(
                            response => {
                                console.log(response)
                                navigate("/profile")
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

    return (
        <>
            <HomeNav/>
            <div className="upload-profile-image-container">
                <h2>PROFILE IMAGE</h2>
                <section className="image-options">
                    <div className={`${preview ? "user-image-container selected":""}`}>
                        {selectedFile ?
                            <>
                                <img src={preview}/>
                                <button className="secondary-button" onClick={() => {handleClick()}}>remove</button>
                            </> :
                            (<>
                                <label htmlFor="file">
                                    <BiImageAdd className="user-option"/>
                                </label>
                                <input id="file" type='file' className="inputfile" onChange={onSelectFile} />
                            </>)
                        }
                    </div>
                    <div>
                        <img src={profile_img_2} className="default-option-female"/>
                    </div>
                    <div>
                        <img src={profile_img_1} className="default-option-male"/>
                    </div>
                </section>
                <button className="primary-button" onClick={() => {handleSubmit()}}>Lets go</button>
            </div>
        </>
    )
}

export default ProfileImageCRUD