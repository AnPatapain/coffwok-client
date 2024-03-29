import pink_location_icon from "../assets/icons/pink-location-icon.svg"
import LogoContainer from "./LogoContainer.jsx";

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <LogoContainer/>
            <div className="title">
                <h2>All Profiles</h2>
                <span>
                <img src={pink_location_icon} className="location-icon"/>
                <h4>Quy Nhơn, VietNam</h4>
            </span>
            </div>
        </div>
    )
}

export default HorizontalNav