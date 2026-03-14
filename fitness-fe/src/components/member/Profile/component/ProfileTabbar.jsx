import { useEffect, useState } from "react";
import {
  Heart,
  Calendar,
  CheckSquare,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import ProfileBodyMetric from "./BodyMetric/ProfileBodyMetric";
import StatisticsWorkout from "./WorkoutHistory/StatisticsWorkout";
import ProfileMessage from "../../ProfileMessage";
import { getPTChat } from "@/services/member/Message";

export default function ProfileTabBar() {
  const [activeTab, setActiveTab] = useState(0);
  const [pt, setPt] = useState(null);
  const tabs = [
    { id: 0, label: "BMI", icon: Heart },
    { id: 1, label: "Gói tập", icon: Dumbbell },
    { id: 2, label: "Lịch tập", icon: Calendar },
    { id: 3, label: "Checklist", icon: CheckSquare },
    { id: 4, label: "Nhắn tin", icon: MessageCircle },
    { id: 5, label: "Lịch sử tập", icon: MessageCircle },
  ];
  useEffect(() => {
    const fetchPT = async () => {
      const res = await getPTChat();
      setPt(res.data[0]);
    };

    fetchPT();
  }, []);
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
        {tabs[activeTab].id === 0 && <ProfileBodyMetric />}
        {tabs[activeTab].id === 5 && <StatisticsWorkout />}
        {tabs[activeTab].id === 4 && <ProfileMessage pt={pt} />}
      </main>
    </div>
  );
}
