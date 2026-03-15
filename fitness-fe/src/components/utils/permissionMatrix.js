export const ACTIONS = ["create", "read", "update", "delete"];

export function buildPermissionMatrix(listPermissions) {
  const map = {};

  listPermissions.forEach((p) => {
    const [module, action] = p.code.split(".");

    if (!map[module]) {
      map[module] = {
        name: module,
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
