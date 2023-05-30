import coffwokLogo from "../assets/coffwok-logo.png"

const Nav = () => {
    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={coffwokLogo}/>
                <h3>Coffwok</h3>
            </div>

        </nav>
    )
}

export default Nav