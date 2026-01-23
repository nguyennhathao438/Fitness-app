import Footer from "../components/member/Footer";
import Header from "../components/member/Header";
import { Outlet } from "react-router-dom";
export default function DefaultMember() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
