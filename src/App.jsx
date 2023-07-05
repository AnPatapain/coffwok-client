import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import OAuth2Redirect from "./pages/authHandler/OAuth2Redirect.jsx";
import Profile from "./pages/Profile.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import LocalAuthRedirect from "./pages/authHandler/LocalAuthRedirect.jsx";
import ProfileCRUD from "./pages/ProfileCRUD.jsx";
import ProfileImageCRUD from "./pages/ProfileImageCRUD.jsx";
import PlanCrud from "./pages/PlanCrud.jsx";
import Chat from "./pages/Chat.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/profile/:id"} element={<Profile />}/>
                <Route path={"/dashboard"} element={<DashBoard />}/>
                <Route path={"/profile-info-creation"} element={<ProfileCRUD />} />
                <Route path={"/profile-image-creation"} element={<ProfileImageCRUD/>} />
                <Route path={"/oauth2/redirect"} element={<OAuth2Redirect/>}/>
                <Route path={"/localAuth/redirect"} element={<LocalAuthRedirect/>}/>
                <Route path={"/plan-creation"} element={<PlanCrud/>}/>
                <Route exact path={"/chat"} element={<Chat/>}/>
                <Route path={"/chat/:id"} element={<Chat/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App