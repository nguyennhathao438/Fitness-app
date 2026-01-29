import { useState } from "react";
import { Heart, Calendar, CheckSquare, MessageCircle } from "lucide-react";
import MemberBMI from "./MemberBMI";
// Content Components
// const BMIContent = () => (
//   <div className="pt-4 px-4">
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold">BMI</h1>
//       <p className="text-gray-600">Nội dung BMI sẽ ở đây</p>
//     </div>
//   </div>
// );

// const TrainingContent = () => (
//   <div className="pt-4 px-4">
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold">Lịch Tập</h1>
//       <p className="text-gray-600">Nội dung lịch tập sẽ ở đây</p>
//     </div>
//   </div>
// );

// const ChecklistContent = () => (
//   <div className="pt-4 px-4">
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold">Checklist</h1>
//       <p className="text-gray-600">Nội dung checklist sẽ ở đây</p>
//     </div>
//   </div>
// );

// const MessagesContent = () => (
//   <div className="pt-4 px-4">
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold">Nhắn Tin</h1>
//       <p className="text-gray-600">Nội dung nhắn tin sẽ ở đây</p>
//     </div>
//   </div>
// );

export default function TabBar() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "BMI", icon: Heart},
    { id: 1, label: "Lịch tập", icon: Calendar },
    { id: 2, label: "Checklist", icon: CheckSquare},
    { id: 3, label: "Nhắn tin", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col">
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
        {tabs[activeTab].id === 0 && <MemberBMI/>}
      </main>
    </div>
  );
}