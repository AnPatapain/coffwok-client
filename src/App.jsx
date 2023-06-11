import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import OAuth2Redirect from "./pages/authHandler/OAuth2Redirect.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import PlanNewfeeds from "./pages/PlanNewfeeds.jsx";
import LocalAuthRedirect from "./pages/authHandler/LocalAuthRedirect.jsx";
import ProfileCRUD from "./pages/ProfileCRUD.jsx";
import ProfileImageCRUD from "./pages/ProfileImageCRUD.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/profile"} element={<MyProfile/>}/>
                <Route path={"/plans"} element={<PlanNewfeeds />}/>
                <Route path={"/profile-info-creation"} element={<ProfileCRUD />} />
                <Route path={"/profile-image-creation"} element={<ProfileImageCRUD/>} />
                <Route path={"/oauth2/redirect"} element={<OAuth2Redirect/>}/>
                <Route path={"/localAuth/redirect"} element={<LocalAuthRedirect/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App