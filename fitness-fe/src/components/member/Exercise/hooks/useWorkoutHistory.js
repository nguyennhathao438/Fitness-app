import { useEffect, useState } from "react"
import {
    getWorkoutHistoryToday,
    getLatestWorkoutHistory,
    getWorkoutHistories,
} from "../../../../services/member/WorkoutHistory"
import { getWorkoutHistoryDetails } from "../../../../services/member/WorkoutHistoryDetail"
export const useWorkoutHistory = () => {
    const [workoutToday, setWorkoutToday] = useState(null)
    const [workoutAll, setWorkoutAll] = useState([])
    const [workoutLatest, setWorkoutLatest] = useState(null)
    const [workoutDetails, setWorkoutDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetch()
    }, [])

    const fetch = async () => {
        setIsLoading(true)
        try {
            const [workoutAllRes,todayRes, latestRes] = await Promise.all([
                getWorkoutHistories(),
                getWorkoutHistoryToday(),
                getLatestWorkoutHistory()
            ])
            const workoutAll = workoutAllRes?.data?.data || []
            const todayWorkout = todayRes?.data?.data || null
            const latestWorkout = latestRes?.data?.data || null
            setWorkoutAll(workoutAll)
            setWorkoutToday(todayWorkout)
            setWorkoutLatest(latestWorkout)
            if (todayWorkout?.id) {
                const detailRes = await getWorkoutHistoryDetails(todayWorkout.id)
                setWorkoutDetails(detailRes?.data?.data || [])
            }
        } catch (error) {
            console.log("Không thể lấy dữ liệu workout history", error)
        } finally {
            setIsLoading(false)
        }

    }
    return {
        workoutAll,
        workoutToday,
        workoutLatest,
        workoutDetails,
        isLoading,
        refetch: fetch
    }
}