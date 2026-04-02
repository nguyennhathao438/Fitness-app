export const ACTIONS = ["create", "read", "update", "delete"];

export function buildPermissionMatrix(listPermissions) {
  const map = {};
  const moduleNameMap = {
    user: "Quản lý người dùng",
    package: "Quản lý gói tập",
    invoice: "Quản lý hóa đơn",
    permission: "Phân quyền",
    message_admin: "Tin nhắn(Admin)",
    message_pt: "Tin nhắn(PT)",
    message_user: "Tin nhắn(Member)",
    workout: "Chức năng tập luyện(Member)",
    nutrition: "Chức năng dinh dưỡng(Member)",
    schedule_pt: "Quản lý lịch PT",
    schedule_user: "Đặt lịch tập luyện(Member)",
    member: "Quản lý học viên",
    exercise: "Quản lý bài tập",
    statistic: "Thống kê ",
  };
  listPermissions.forEach((p) => {
    const [module, action] = p.code.split(".");

    if (!map[module]) {
      map[module] = {
        name: moduleNameMap[module] || module,
        create: null,
        read: null,
        update: null,
        delete: null,
      };
    }

    map[module][action] = p;
  });

  return Object.values(map);
}
