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
