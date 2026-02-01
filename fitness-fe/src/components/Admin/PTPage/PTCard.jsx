import { BoltIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Dialog from "../Dialog";
import { useState } from "react";
import PTForm from "../PTForm";
import DetailDialog from "../DetailDialog";
import PTInfoTab from "./PTInfoTab";

export default function PTCard({pt,onDeleteClick,onEditClick}) {
    const [openView, setOpenView] = useState(false);
    // Function to get initials from name
    function getInitials(name) {
    if (!name) return "";

    const words = name.trim().split(/\s+/);
    const first = words[0][0];
    const last = words[words.length - 1][0];

    return (first + last).toUpperCase();
    }
    // Hiển thị Thẻ thông tin PT 
    return(
        <>
        <div className="w-[140px] sm:w-11/12 lg:w-[260px] h-auto sm:full md:54 shadow-lg rounded-xl overflow-hidden transform
         transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl">
            <div className="bg-[#9333EA] rounded-t-xl flex justify-between p-3">
                <div className="">
                    <div className="bg-[#A870FF] p-2 sm:p-3 rounded-2xl mb-2 w-max"><p className="text-sm sm:text-lg">{getInitials(pt.name)}</p></div>
                    <p className="text-white max-sm:hidden">{pt.name}</p>
                </div>
                <div className="text-white mr-3 grid grid-cols-1">
                    <button>
                        <Trash2Icon className="w-7 h-7 hover:bg-[#ad7aff] rounded-lg"
                        onClick={onDeleteClick}/>
                    </button>
                    <button onClick={onEditClick}>
                        <BoltIcon className="w-7 h-7 hover:bg-[#ad7aff] rounded-lg"/>
                    </button>
                </div>
            </div>
            <div className="p-2 m-auto bg-white space-y-2">
                <div className="space-x-1 sm:space-x-8">
                    <p className="inline-block">Gender:</p>
                    <span className="font-bold">{pt.gender}</span>
                </div>
                <div className="space-x-5">
                    <span className="inline-block max-sm:text-sm">Active Member:</span>
                    <span className="font-bold">8 members</span>
                </div>
                <div className="flex justify-center">
                    <button className="flex justify-center gap-2 mt-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg w-2/3"
                    onClick={() => setOpenView(true)}
                    >
                    <EyeIcon/>
                    <span className="">View Details</span>
                    </button>
                </div>
            </div>
        </div>
        {/* View PT Dialog */}
        <Dialog open={openView} onClose={() => setOpenView(false)}>
            <DetailDialog
            avatar={pt.avatar}
            title={pt.name}
            tabs={[
                {
                id: "info",
                label: "Thông tin tài khoản",
                content: <PTInfoTab pt={pt} />,
                },
                {
                id: "members",
                label: "Các hội viên",
                // content: <PTMembersTab ptId={pt.id} />,
                },
                {
                id: "schedule",
                label: "Lịch tập",
                // content: <PTScheduleTab ptId={pt.id} />,
                },
            ]}
            />
        </Dialog>
        </>
    );
};