import { useState } from "react";

export default function DetailDialog({ title, avatar, tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="w-[full] sm:w-[520px] lg:w-[600px] xl:w-[720px] bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/30 flex items-center justify-center">
          <img
            src={avatar || "/avatar-default.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition
              ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-purple-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
