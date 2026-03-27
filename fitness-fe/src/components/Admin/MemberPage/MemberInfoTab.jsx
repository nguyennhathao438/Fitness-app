import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  DumbbellIcon,
  Package2Icon,
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
            value={
                  member.activept?.pt?.name
                    ? member.activept.pt.name
                    : "--"
                }
        />
        </div>

        {/* ===== Package info ===== */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-3 flex gap-2"><Package2Icon/><span>Hạn gói tập</span></div>

            <div className="space-y-1 text-sm">
            <p>
                Thời hạn: <span className="font-semibold">{member.invoice?.valid_until ?? "--"}</span>
            </p>
            <p>
                Ngày sử dụng:{" "}
                <span className="font-semibold">
                {/* {new Date(member.startDate).toLocaleDateString("vi-VN")} */} 
                {member.invoice?.start_date
                ? member.invoice.start_date
                : "--"}
                </span>
            </p>
            <p className="text-red-500 font-semibold">
                {member.invoice?.days_left > 0
                ? `Còn lại ${member.invoice.days_left} ngày`
                : "Đã hết hạn"}
            </p>
            </div>
        </div>
        {/* ===== Role info ===== */}
        <div className="flex flex-wrap gap-3">
            {member.roles && member.roles.length > 0 ? (
                member.roles.map((role) => (
                <span
                    key={role.id}
                    className="
                    inline-flex items-center px-4 py-1.5 rounded-full bg-pink-100 text-purple-700 font-semibold text-sm shadow-sm"
                >
                    {role.name}
                </span>
                ))
            ) : (
                <span className="text-gray-400 text-sm">No role assigned</span>
            )}
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
