
import { getBodyMetric, getLatestBodyMetric } from "@/services/member/MemberService"
import { useEffect, useState } from "react"

export const useBodyMetric = () => {
    const [bodyMetricNew, setBodyMetricNew] = useState([])
    const [bodyMetricList, setBodyMetricList] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const [latestRes, listRes] = await Promise.all([
                getLatestBodyMetric(),
                getBodyMetric(),
            ]);

            setBodyMetricNew(latestRes?.data?.data || []);
            setBodyMetricList(listRes?.data?.data || []);
        };

        fetch();
    }, []);
    const fetch = async () => {
        const [latestRes, listRes] = await Promise.all([
            getLatestBodyMetric(),
            getBodyMetric(),
        ]);

        setBodyMetricNew(latestRes?.data?.data || []);
        setBodyMetricList(listRes?.data?.data || []);
    };

    return {
        bodyMetricNew,
        bodyMetricList,
        refetch: fetch,
    }
}
