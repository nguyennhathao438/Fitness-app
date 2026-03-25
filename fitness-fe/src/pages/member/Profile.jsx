import { User, Save, CheckCircle } from "lucide-react";
import ProfileTabBar from "../../components/member/Profile/component/ProfileTabbar";
import MemberInfo from "@/components/member/Profile/component/MemberInfo";
export default function Profile() {
    return (
        <div>
            <MemberInfo/>
            <ProfileTabBar/>
        </div>
    );
}