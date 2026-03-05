import FoodComparison from "../../components/member/FoodComparison";
import Banner from "../../components/member/Banner";
import InfoPackage from "../../components/member/InfoPackage";
import BenefitsSection from "../../components/member/BenefitSection";
import ChatBox from "../../components/member/ChatBox";
export default function Home() {
  return (
    <div>
      <Banner/>
      <InfoPackage/>
      <FoodComparison/>
      <BenefitsSection/>
      <ChatBox />
    </div>
  );
}
