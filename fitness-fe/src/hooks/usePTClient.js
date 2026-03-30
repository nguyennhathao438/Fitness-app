import { useState } from "react";
import { getAllforPT, getStatsMembersOfPT} from "@/services/admin/PersonalTrainerService";

const usePTClient = () => {
    const [memberOfPT, setMemberOfPT] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expired: 0,
    });

    // lấy danh sách học viên
    const fetchMemberOfPT = async (id) => {
        try {
            const response = await getAllforPT(id);
            setMemberOfPT(response.data.data);
        } catch (error) {
            console.log("Lỗi fetch member", error);
        }
    };

    // lấy thống kê
    const fetchStats = async (ptId) => {
        try {
            const res = await getStatsMembersOfPT(ptId);
            setStats(res.data.data);
        } catch (error) {
            console.log("Lỗi stats", error);
        }
    };

    return {
        memberOfPT,
        stats,
        fetchMemberOfPT,
        fetchStats
    };
};

export default usePTClient;