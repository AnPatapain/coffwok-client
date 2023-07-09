import {GrMapLocation} from "react-icons/gr";

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <h2>Bảng kế hoạch</h2>
            <span>
                <GrMapLocation className="location-icon"/>
                <h4>Quy Nhơn</h4>
            </span>
        </div>
    )
}

export default HorizontalNav