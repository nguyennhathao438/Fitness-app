import { useEffect, useState } from "react";
import { getAllforPT } from "@/services/admin/PersonalTrainerService";
import MemberCard from "./MemberCard";

export default function PTMembersTab({ pt }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pt?.id) return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await getAllforPT(pt.id);
        setMembers(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [pt]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Đang tải danh sách hội viên...
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400">
        PT này chưa có hội viên đang hoạt động
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-sm:h-[400px]">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} />
      ))}
    </div>
  );
}
