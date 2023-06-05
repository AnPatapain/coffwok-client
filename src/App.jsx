import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import OAuth2Redirect from "./api/authentication/OAuth2Redirect.jsx";
import Profile from "./pages/Profile.jsx";
import PlanNewfeeds from "./pages/PlanNewfeeds.jsx";
import LocalAuthRedirect from "./api/authentication/LocalAuthRedirect.jsx";
import ProfileCRUD from "./pages/ProfileCRUD.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/profile"} element={<Profile/>}/>
                <Route path={"/plans"} element={<PlanNewfeeds />}/>
                <Route path={"/profile-creation"} element={<ProfileCRUD />} />
                <Route path={"/oauth2/redirect"} element={<OAuth2Redirect/>}/>
                <Route path={"/localAuth/redirect"} element={<LocalAuthRedirect/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App