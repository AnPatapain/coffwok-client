import {useEffect, useState} from "react";
import {BiImageAdd} from "react-icons/bi"
import HomeNav from "../components/HomeNav.jsx";
import ProfileService from "../api/services/profile.service.js";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../api/error/errorMessage.js";
import UserService from "../api/services/user.service.js";
import {ACCESS_TOKEN, PROFILE_IMG} from "../api/constant/index.js";
import {RotatingSquare} from 'react-loader-spinner';
import localStorageService from "../api/services/localStorage.service.js";

const ProfileImageCRUD = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

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
            setSelectedFile(undefined);
            return;
        }

        const file = e.target.files[0];
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
            const arrayBuffer = fileReader.result;
            const uintArray = new Uint8Array(arrayBuffer);
            let isImage = false;

            // Check the file signature to determine if it's an image
            if (uintArray && uintArray.length >= 2) {
                const signature = uintArray.subarray(0, 2);

                // JPEG/JFIF files start with the following signature: [0xFF, 0xD8]
                // PNG files start with the following signature: [0x89, 0x50]
                // GIF files start with the following signature: [0x47, 0x49]
                if (
                    (signature[0] === 0xFF && signature[1] === 0xD8) ||
                    (signature[0] === 0x89 && signature[1] === 0x50) ||
                    (signature[0] === 0x47 && signature[1] === 0x49)
                ) {
                    isImage = true;
                }
            }

            if (isImage) {
                setSelectedFile(file);
                // Perform further processing for image file
            } else {
                setErrorMessage("File must be image :  )")
            }
        };

        fileReader.readAsArrayBuffer(file);
    };


    const handleClick = () => {
        if (selectedFile && preview) {
            setSelectedFile(undefined)
            setPreview(null)
            setErrorMessage(null)
        }
    }

    const handleSubmit = () => {
        if (selectedFile === null) {
            setErrorMessage("You must upload image")
        } else {
            UserService.getCurrentUser()
                .then(user => {
                    if (user.profileId === null) {
                        navigate("/profile-info-creation?isEdit=false")
                    } else {
                        setLoading(true)
                        ProfileService.uploadProfileImage(user.profileId, selectedFile)
                            .then(
                                response => {
                                    console.log(response)
                                    localStorageService.add(PROFILE_IMG, response.data.imgUrl)
                                    navigate("/profile/" + user.profileId)
                                },
                                error => {
                                    setLoading(false)
                                    setErrorMessage("Max file size is 500kb : )")
                                    const resMessage = getErrorMessage(error)
                                    console.log("image upload error", resMessage)
                                }
                            )
                    }
                })
                .catch(error => {
                    console.log(error)
                    if (localStorage.getItem(ACCESS_TOKEN)) {
                        localStorage.removeItem(ACCESS_TOKEN)
                    }
                    navigate("/")
                })
        }

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
                            <button className="secondary-button" onClick={() => {
                                handleClick()
                            }}>remove
                            </button>
                        </div> : ""
                    }
                    <div className={`${preview ? "image-choose selected" : "image-choose"}`}>
                        <>
                            <label htmlFor="file">
                                <BiImageAdd className="user-option"/>
                            </label>
                            <input id="file" type='file' className="inputfile" onChange={onSelectFile}/>
                        </>
                    </div>
                </section>
                {errorMessage ? <p className="error-msg">{errorMessage}</p> : ""}
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
                    : <button className="primary-button" onClick={() => {
                        handleSubmit()
                    }}>lets goo</button>
                }

            </div>
        </>
    )
}

export default ProfileImageCRUD