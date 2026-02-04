export const ACTIONS = ["create", "read", "update", "delete"];

export function buildPermissionMatrix(listPermissions) {
  const map = {};

  listPermissions.forEach((p) => {
    if (!map[p.name]) {
      map[p.name] = {
        name: p.name,
        create: null,
        read: null,
        update: null,
        delete: null,
      };
    }

    // store full permission object so callers can access id and code
    map[p.name][p.action] = p;
  });

  return Object.values(map);
}
