import api from "../../api.js";

export const getAllBodyMetric = (memberId) => {
    return api.get(`/body-metrics/${memberId}`);
};
export const getBodyMetricLatest = (memberId) => {
    return api.get(`/body-metrics/latest/${memberId}`);
}