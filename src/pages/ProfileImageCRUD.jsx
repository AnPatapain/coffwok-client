import {useEffect, useState} from "react";
import {BiImageAdd} from "react-icons/bi"
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import UserService from "../api/services/user.service.js";
import {ACCESS_TOKEN} from "../api/constant/index.js";
import {RotatingSquare} from 'react-loader-spinner';

const ProfileImageCRUD = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
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
                    setLoading(true)
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
                    {preview ?
                        <div className="image-container">
                            <img src={preview}/>
                            <button className="secondary-button" onClick={() => {handleClick()}}>remove</button>
                        </div> : ""
                    }
                    <div className={`${preview ? "image-choose selected":"image-choose"}`}>
                        <>
                            <label htmlFor="file">
                                <BiImageAdd className="user-option"/>
                            </label>
                            <input id="file" type='file' className="inputfile" onChange={onSelectFile} />
                        </>
                    </div>
                </section>
                {loading ?
                    <div className="loader"><RotatingSquare
                        height="100"
                        width="100"
                        color="#9AFB4D"
                        ariaLabel="rotating-square-loading"
                        strokeWidth="4"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    /></div>
                    : <button className="primary-button" onClick={() => {handleSubmit()}}>lets goo</button>
                }

            </div>
        </>
    )
}

export default ProfileImageCRUD