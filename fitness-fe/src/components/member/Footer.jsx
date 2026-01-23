export default function Footer() {
  const contactInfo = [
    "CS Quận 1: 39/9 Trần Nhật Duật, P.Tân Định, Q.1",
    "CS Quận 10: 136 - 138 Tam Đảo, P.14, Q.10",
    "CS Quận 10: 223-225 Lý Thái Tổ, P.9, Q.10",
  ];

  const menuLinks = [
    { label: "Tin tức", href: "/tin-tuc" },
    { label: "Tuyển dụng", href: "/tuyen-dung" },
    { label: "Liên hệ", href: "/lien-he" },
    { label: "Chính sách", href: "/chinh-sach" },
  ];

  return (
    <footer className="bg-black text-white py-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Contact Section */}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 tracking-wide">LIÊN HỆ</h3>
            <div className="space-y-1 text-gray-300 text-sm">
              {contactInfo.map((info, index) => (
                <p key={index}>{info}</p>
              ))}
              <p>
                Hotline:{" "}
                <a
                  href="tel:02888866858"
                  className="underline hover:text-purple-400 transition-colors"
                >
                  0288 886 68 58
                </a>
              </p>
              <p className="text-gray-400 mt-2">
                Thứ Hai - Chủ Nhật: 6:00 - 21:00
              </p>
            </div>
          </div>

          {/* Menu Section */}
          <div className="md:text-right">
            <h3 className="text-lg font-bold mb-2 tracking-wide">DANH MỤC</h3>
            <nav className="space-y-1">
              {menuLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 text-sm hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-xs">
          <p>© 2025 FIGHTICO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
