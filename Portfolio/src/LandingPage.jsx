import Header from "./Pages/Header";
import HeroSection from "./Herosection";
import Footer from "./Pages/Footer";
import SkillsSection from "./Pages/SkillsSection";
import TechnicalArchitecture from "./Pages/TechArch";
const LandingPage = () => {
    return (
        <div className="relative">
            <Header />
            <HeroSection />
            <SkillsSection />
            <TechnicalArchitecture />
            <Footer />
        </div>
    )
}
export default LandingPage;