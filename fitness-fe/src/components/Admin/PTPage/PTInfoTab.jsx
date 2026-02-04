import { MailIcon, PhoneIcon, UserCheckIcon, UserIcon } from "lucide-react";

export default function PTInfoTab({ pt }) {
    return (
        <div className="p-3 rounded-md">
            {/* Age/Gender/Phone */}
            <div className="flex gap-9 mb-7">
                <div className="bg-white flex w-[300px] px-3 py-4 rounded-lg space-x-5 shadow-md">
                    <div className="bg-[#DBEAFE] px-2 py-3 rounded-xl"><UserIcon className="text-[#2563EB]"/></div>
                    <span>
                        <p>Age/Gender</p>
                        <p className="font-bold">{pt.age}/{pt.gender}</p>
                    </span>
                </div>

                <div className="bg-white shadow-md flex w-[300px] px-3 py-4 rounded-lg space-x-5">
                    <div className="bg-[#DCFCE7] px-2 py-3 rounded-xl"><PhoneIcon className="text-[#16A34A]"/></div>
                    <span>
                        <p>Phone</p>
                        <p className="font-bold">{pt.phone}</p>
                    </span>
                </div>
            </div>
            {/* Email_ActiveMember */}
            <div className="flex gap-9 mb-7">
                <div className="bg-white shadow-md flex w-[300px] px-3 py-4 rounded-lg space-x-5">
                    <div className="bg-[#F3E8FF] px-2 py-3 rounded-xl"><MailIcon className="text-[#9333EA]"/></div>
                    <span>
                        <p>Email</p>
                        <p className="font-bold">{pt.email}</p>
                    </span>
                </div>

                <div className="bg-white shadow-md flex w-[300px] px-3 py-4 rounded-lg space-x-5">
                    <div className="bg-[#AFC8FF] px-2 py-3 rounded-xl"><UserCheckIcon className="text-[#2563EB]"/></div>
                    <span>
                        <p>Active Members</p>
                        <p className="font-bold">8</p>
                    </span>
                </div>
            </div>

            <div>
                role...
            </div>
        </div>
    );
};