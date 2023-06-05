import coffwokLogo from "../assets/coffwok-logo.png";

const LogoContainer = () => {
    return (
        <div className="logo-container">
            <img className="logo" src={coffwokLogo}/>
            <h3>Coffwok</h3>
        </div>
    )
}

export default LogoContainer