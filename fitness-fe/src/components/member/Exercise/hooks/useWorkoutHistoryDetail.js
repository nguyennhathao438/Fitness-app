import { useEffect, useState } from "react"
import { getAllWorkoutHistoryDetails } from "../../../../services/member/WorkoutHistoryDetail"

export const useWorkoutHistoryDetail = () => {
    const [workoutDetails, setWorkoutDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchDetails()
    }, [])

    const fetchDetails = async () => {
        setIsLoading(true)
        try {
            const res = await getAllWorkoutHistoryDetails()
            setWorkoutDetails(res?.data?.data || [])
        } catch (error) {
            console.log("Không thể lấy workout history details", error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        workoutDetails,
        isLoading,
        refetch: fetchDetails
    }
}