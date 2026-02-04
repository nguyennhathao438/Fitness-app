import AgePieChart from "./AgePieChart";
import AgeStatCards from "./AgeStatCard";
import { TransgenderIcon, UserCheck } from "lucide-react";
import ProgressBarStat from "../ProgressBarStat";
export default function MemberStatContent({ genderStats , ageStats }) {

  return (
    <div className="space-y-2">
      <div className="bg-gray-50 p-3 flex justify-between items-center w-full md:w-[560px] lg:w-[900px] xl:w-auto gap-5 rounded-xl">
            <div className="bg-white w-[200px] lg:w-[400px] xl:w-[550px] rounded-xl">
              <ProgressBarStat
              icon={<TransgenderIcon/>}
              title="Phân bố theo giới tính"
              items={[
                { label: "Nam", value:genderStats.gender.male, color: "bg-blue-500" },
                { label: "Nữ", value:genderStats.gender.female, color: "bg-pink-500" },
              ]}
            />
            </div>
            <div className="bg-white w-[200px] lg:w-[400px] xl:w-[550px] rounded-xl">
              <ProgressBarStat
              icon={<UserCheck/>}
              title="Phân bố theo hội viên"
              items={[
              { label: "Thường", value: 600, color: "bg-green-500" },
              { label: "VIP", value: 400, color: "bg-yellow-500" },
              ]}
            />
            </div>
      </div>
      <div className="bg-gray-50 p-5 rounded-xl">
        <div className="flex gap-6 items-center">
          
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <h3 className="font-semibold text-gray-700">
                Phân bố theo độ tuổi
              </h3>
            </div>

            <AgePieChart data={ageStats.data} />
          </div>

          {/* RIGHT */}
          <AgeStatCards data={ageStats.data} />
        </div>
      </div>
    </div>
  );
}
