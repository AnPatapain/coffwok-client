import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import OAuth2Redirect from "./components/authentication/OAuth2Redirect.jsx";
import Profile from "./pages/Profile.jsx";
import PlanNewfeeds from "./pages/PlanNewfeeds.jsx";
import LocalAuthRedirect from "./components/authentication/LocalAuthRedirect.jsx";
import ProfileCRUD from "./pages/ProfileCRUD.jsx";
import ProfileImageCRUD from "./pages/ProfileImageCRUD.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/profile"} element={<Profile/>}/>
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