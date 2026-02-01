import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  DumbbellIcon,
} from "lucide-react";

export default function MemberInfoTab({ member }) {
  return (
    <div className="space-y-6">
      {/* ===== 4 info cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age / Gender */}
        <InfoCard
            className="bg-[#DBEAFE]"
            icon={<UserIcon className="w-5 h-5 text-blue-600" />}
            title="Age/Gender"
            value={`${member?.age > 0 ? member.age : "--"} / ${member?.gender ?? "--"}`}
        />

        {/* Phone */}
        <InfoCard
            className="bg-[#DCFCE7]"    
            icon={<PhoneIcon className="w-5 h-5 text-green-600" />}
            title="Phone"
            value={member.phone}
        />

        {/* Email */}
        <InfoCard
            className="bg-[#F3E8FF]"
            icon={<MailIcon className="w-5 h-5 text-purple-600" />}
            title="Email"
            value={member.email}
        />

        {/* Trainer */}
        <InfoCard
            className="bg-[#DBEAFE]"
            icon={<DumbbellIcon className="w-5 h-5 text-indigo-600" />}
            title="Huấn luyện viên"
            value="Nguyen A"
        />
        </div>

        {/* ===== Package info ===== */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Hạn gói tập</h3>

            <div className="space-y-1 text-sm">
            <p>
                Thời hạn: <span className="font-semibold">20 ngày</span>
            </p>
            <p>
                Ngày sử dụng:{" "}
                <span className="font-semibold">
                {/* {new Date(member.startDate).toLocaleDateString("vi-VN")} */} 
                2/2/2025
                </span>
            </p>
            <p className="text-red-500 font-semibold">
                Còn lại 10 ngày
            </p>
            </div>
        </div>
        {/* ===== Role info ===== */}
        <div className="bg-white shadow-md rounded-xl p-5">
            <p>Role...</p>
        </div>
    </div>
  );
}

/* ===== Reusable card ===== */
function InfoCard({ icon, title, value,className=""}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm ">
      <div className={`p-2 rounded-lg ${className}`}>
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
