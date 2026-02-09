
import { getBodyMetric, getLatestBodyMetric } from "@/services/member/MemberService"
import { useEffect, useState } from "react"

export const useBodyMetric = () => {
    const [bodyMetricNew, setBodyMetricNew] = useState([])
    const [bodyMetricList, setBodyMetricList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true)
            try {
                const [latestRes, listRes] = await Promise.all([
                    getLatestBodyMetric(),
                    getBodyMetric(),
                ]);

                setBodyMetricNew(latestRes?.data?.data || []);
                setBodyMetricList(listRes?.data?.data || []);
            } catch (error) {
                console.log("Lỗi không thể lấy dữ liệu body-metric", error)
            } finally {
                setIsLoading(false)
            }
        };
        fetch();
    }, []);

    const fetch = async () => {
        setIsLoading(true)
        try {
            const [latestRes, listRes] = await Promise.all([
                getLatestBodyMetric(),
                getBodyMetric(),
            ]);

            setBodyMetricNew(latestRes?.data?.data || []);
            setBodyMetricList(listRes?.data?.data || []);
        } catch (error) {
            console.log("Lỗi không thể lấy dữ liệu", error)
        } finally {
            setIsLoading(false)
        }
    };

    return {
        bodyMetricNew,
        bodyMetricList,
        isLoading,
        refetch: fetch,
    }
}
