import { useState } from "react";
<<<<<<< HEAD:fitness-fe/src/components/member/ProfileTabbar.jsx
import { Heart, Calendar, CheckSquare, MessageCircle,Dumbbell} from "lucide-react";
import ProfileBMI from "./ProfileBMI";
import ProfilePackage from "./ProfilePackage";
=======
import {
  Heart,
  Calendar,
  CheckSquare,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import ProfileBodyMetric from "./BodyMetric/ProfileBodyMetric";
import StatisticsWorkout from "./WorkoutHistory/StatisticsWorkout";
import MemberRegisterPage from "@/pages/MemberSchedule/MemberRegisterPage";
>>>>>>> dev:fitness-fe/src/components/member/Profile/component/ProfileTabbar.jsx

export default function ProfileTabBar() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, label: "BMI", icon: Heart },
    { id: 1, label: "Gói tập", icon: Dumbbell },
    { id: 2, label: "Lịch tập", icon: Calendar },
    { id: 3, label: "Checklist", icon: CheckSquare },
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
<<<<<<< HEAD:fitness-fe/src/components/member/ProfileTabbar.jsx
        {tabs[activeTab].id === 0 && <ProfileBMI/>}
        {tabs[activeTab].id === 1 && <ProfilePackage />}
=======
        {tabs[activeTab].id === 0 && <ProfileBodyMetric />}
        {tabs[activeTab].id === 2 && <MemberRegisterPage />}
        {tabs[activeTab].id === 4 && <StatisticsWorkout />}
>>>>>>> dev:fitness-fe/src/components/member/Profile/component/ProfileTabbar.jsx
      </main>
    </div>
  );
}
