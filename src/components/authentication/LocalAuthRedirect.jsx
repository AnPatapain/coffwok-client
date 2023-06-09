import {Navigate, useLocation} from "react-router-dom";

const LocalAuthRedirect = () => {
    const location = useLocation()
    console.log(location)
    return (
        <Navigate to={"/profile-info-creation?isEdit=false"} />
    )
}

export default LocalAuthRedirect