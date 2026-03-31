import Footer from "../components/member/Footer";
import Header from "../components/member/Header";
import { Outlet } from "react-router-dom";
import ChatBox from "../components/member/ChatBox";
import { useSelector } from "react-redux";
export default function DefaultMember() {
  const { member } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen">
      <Header className="sticky top-0 z-50 bg-gray-900" />
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
      {member && <ChatBox />}
      <Footer />
    </div>
  );
}
