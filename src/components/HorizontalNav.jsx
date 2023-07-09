import pink_location_icon from "../assets/icons/pink-location-icon.svg"

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <h2>Kế hoạch Glife - Học Bài</h2>
            <span>
                <img src={pink_location_icon} className="location-icon"/>
                <h4>Glife</h4>
            </span>
        </div>
    )
}

export default HorizontalNav