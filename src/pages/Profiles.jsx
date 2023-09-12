import VerticalNav from "../components/VerticalNav.jsx";
import HorizontalNav from "../components/HorizontalNav.jsx";
import PlanCard from "../components/PlanCard.jsx";

const Profiles = () => {
    return (
        <div className="dashboard-page">
            <VerticalNav selectedItem={"profiles"}/>
            <HorizontalNav/>
        </div>
    )
}

export default Profiles