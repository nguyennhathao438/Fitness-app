import FoodComparison from "@/components/member/Home/FoodComparison";
import Banner from "@/components/member/Home/Banner";
import InfoPackage from "@/components/member/Home/InfoPackage";
import BenefitsSection from "@/components/member/Home/BenefitSection";
export default function Home() {
  return (
    <div>
      <Banner/>
      <InfoPackage/>
      <FoodComparison/>
      <BenefitsSection/>
    </div>
  );
}
