import { useState } from "react";
import {
  Heart,
  Calendar,
  CheckSquare,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import ProfilePackage from "../../ProfilePackage";
import ProfileBodyMetric from "./BodyMetric/ProfileBodyMetric";
import StatisticsWorkout from "./WorkoutHistory/StatisticsWorkout";
import MemberRegisterPage from "@/pages/MemberSchedule/MemberRegisterPage";
import NutritionStatisticsPage from "@/pages/Nutrition/NutritionStatisticsPage";
import RequireMember from "@/pages/utils/RequireMember";
import { useSelector } from "react-redux";
import WaitingForRegister from "@/pages/member/WaitingForRegister";
import UpgradeModal from "@/components/utils/UpgradeModal";
export default function ProfileTabBar() {
  const statusInvoice = useSelector((state) => state.auth.statusInvoice);
  const roles = useSelector((state) => state.auth.roles) || [];
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, label: "BMI", icon: Heart },
    { id: 1, label: "Gói tập", icon: Dumbbell },
    { id: 2, label: "Lịch tập", icon: Calendar },
    { id: 3, label: "Thống kê dinh dưỡng", icon: CheckSquare },
    { id: 4, label: "Lịch sử tập", icon: MessageCircle },
  ];
  return (
    <div className="flex flex-col">
      {/* TabBar */}
      <div className="bg-white border-b border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1">
        {tabs[activeTab].id === 1 && <ProfilePackage />}
        {tabs[activeTab].id === 0 && <ProfileBodyMetric />}
        {tabs[activeTab].id === 2 &&
          (statusInvoice === "pending" ? (
            <WaitingForRegister />
          ) : roles.includes("MemberVip") ? (
            <MemberRegisterPage />
          ) : (
            <UpgradeModal
              isOpen={true}
              onClose={() => {
                setActiveTab(0);
              }}
            />
          ))}
        {tabs[activeTab].id === 3 && <NutritionStatisticsPage />}
        {tabs[activeTab].id === 4 &&
          (statusInvoice === "pending" ? (
            <WaitingForRegister />
          ) : (
            <StatisticsWorkout />
          ))}
      </main>
    </div>
  );
}
