import api from "../../api.js";

//Lấy loại package
export const getPackageTypes = async () => {
  const res = await api.get("/package-compare");
  return res.data.package_types;
};
//Lấy all gói
export const getTrainingPackages = (packageTypeId) => {
  return api.get("/training-packages", {
    params: {
      package_type_id: packageTypeId,
    },
  });
};
//Lấy tất cả gói
export const getAllTrainingPackages = ()=>{
  return api.get("/training-packages");
}
//Lấy loại gói + dịch vụ
export const getCompareFeatures = async () => {
  return api.get("/package-compare");
};
//Lấy gói by id
export const getTrainingPackageById = (id) => {
  return api.get(`/training-packages/${id}`);
};

export const getUpgradablePackages = async (memberId) => {
  const res = await api.get("/packages/upgrade", {
    params: {
      member_id: memberId
    }
  });
  return res.data.data;
}
// Lấy danh sách Tabs 
export const getUpgradableTypes = async (memberId) => {
  const res = await api.get("/packages/upgrade-types", {
    params: { member_id: memberId }
  });
  return res.data.data; 
};

// Lấy danh sách Gói theo Tab ID
export const getUpgradablePackagesByType = async (memberId, typeId) => {
  const res = await api.get("/packages/upgrade-list", {
    params: { 
      member_id: memberId,
      package_type_id: typeId
    }
  });
  return res.data.data; 
};
export const getCurrentPackageInfo = () => {
  return api.get("/member/current-package");
};