import { useSelector } from "react-redux";
import userImg from "../../assets/user.png";
import userActive from "../../assets/userActive.png";
import userExpire from "../../assets/userExpire.png";
import usePTClient from "@/hooks/usePTClient";
import { useEffect } from "react";
export default function DashboardPT() {
    const { member } = useSelector((state) => state.auth)
    const { memberOfPT, fetchMemberOfPT, stats, fetchStats } = usePTClient()
    useEffect(() => {
        if (member?.id) {
            fetchMemberOfPT(member.id);
            fetchStats(member.id)
        }
    }, [member]);

  
    console.log("hahah", memberOfPT)
    console.log("member", member)
    console.log("stats", stats)
    return (
        <div className="border bg-gray-100 py-4 rounded-2xl">
            <h2 className="text-center text-2xl py-2 font-bold">Thông tin của bạn</h2>
            <div className="flex justify-center mb-10">
                <div className="w-full md:w-[90%] py-5 bg-white border rounded-2xl flex md:flex-row flex-col ">
                    <div className="flex flex-col items-center md:w-1/3">
                        <h3 className="mb-3 font-semibold text-gray-700">
                            Ảnh đại diện
                        </h3>
                        <div className="w-40 h-40 md:w-48 md:h-48">
                            <img
                                className="w-full h-full object-cover rounded-full border"
                                src={member?.avatar}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-5 md:mt-0 md:w-2/3">
                        <h2 className="text-gray-700 md:mb-5 font-semibold">Thông tin cá nhân</h2>
                        <div className="w-full flex flex-col md:flex-row gap-4 px-10">
                            <div className="flex-1 flex flex-col md:gap-8 gap-4">
                                <div className="bg-gray-100 rounded-md flex flex-row justify-center md:flex-col py-2 md:px-4 md:mx-4">
                                    <label className="md:block text-center md:text-left font-semibold text-md">Họ và tên :</label>
                                    <label className="md:block text-center md:text-left">{member?.name}</label>
                                </div>
                                <div className="bg-gray-100 flex flex-row justify-center md:flex-col py-2 rounded-md md:px-4 md:mx-4">
                                    <label className="md:block text-center md:text-left font-semibold text-md">Email : </label>
                                    <label className="md:block text-center md:text-left">{member?.email}</label>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col md:gap-8 gap-4">
                                <div className="bg-gray-100 rounded-md flex flex-row justify-center md:flex-col py-2 md:px-4 md:mx-4">
                                    <label className="md:block text-center md:text-left font-semibold text-md">Số điện thoại : </label>
                                    <label className="md:block text-center md:text-left">{member?.phone}</label>
                                </div>
                                <div className="bg-gray-100 rounded-md flex justify-center flex-row md:flex-col py-2 md:px-4 md:mx-4">
                                    <label className="md:block text-center md:text-left font-semibold text-md">Giới tính : </label>
                                    <label className="md:block text-center md:text-left">{member?.gender == "male" ? "Nam" : member?.gender == "female" ? "Nữ" : "Khác"}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5">

  {/* CARD 1 */}
  <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
    <div className="w-12 h-12 md:w-16 md:h-16">
      <img
        className="w-full h-full rounded-full object-cover"
        src={userImg}
        alt=""
      />
    </div>
    <div>
      <p className="text-sm text-gray-500">Tổng học viên</p>
      <h2 className="text-xl md:text-2xl font-bold">
        {memberOfPT.length}
      </h2>
    </div>
  </div>

  {/* CARD 2 */}
  <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
    <div className="w-12 h-12 md:w-16 md:h-16">
      <img
        className="w-full h-full rounded-full object-cover"
        src={userActive}
        alt=""
      />
    </div>
    <div>
      <p className="text-sm text-gray-500">Đang hoạt động</p>
      <h2 className="text-xl md:text-2xl font-bold text-green-600">
        {stats?.active ?? 0}
      </h2>
    </div>
  </div>

  {/* CARD 3 */}
  <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
    <div className="w-12 h-12 md:w-16 md:h-16">
      <img
        className="w-full h-full rounded-full object-cover"
        src={userExpire}
        alt=""
      />
    </div>
    <div>
      <p className="text-sm text-gray-500">Đã hết hạn</p>
      <h2 className="text-xl md:text-2xl font-bold text-red-500">
        {stats?.expired ?? 0}
      </h2>
    </div>
  </div>

</div>
        </div>
    );
}