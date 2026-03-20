import { useEffect, useState } from "react";
import {
    getFavoriteExercises,
    createFavoriteExercise,
    deleteFavoriteExercise,
} from "../../../../services/member/FavoriteExercise";

const useFavoriteExercise = () => {

    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [loadingFavorite, setLoadingFavorite] = useState(true);

    const fetchFavorites = async () => {
        setLoadingFavorite(true);
        try {
            const res = await getFavoriteExercises();
            const ids = res.data.data.map((f) => f.exercise_id);
            const exercises = res.data.data
                .map((f) => f.exercise)
                .filter(Boolean);
            setFavoriteIds(ids);
            setFavoriteExercises(exercises);
        } catch (error) {
            console.error("Lỗi load favorite:", error);
        } finally {
            setLoadingFavorite(false);
        }
    };

    const toggleFavorite = async (exercise) => {
        const isFav = favoriteIds.includes(exercise.id);
        // optimistic update
        if (isFav) {
            setFavoriteIds((prev) =>
                prev.filter((id) => id !== exercise.id)
            );
            setFavoriteExercises((prev) =>
                prev.filter((e) => e.id !== exercise.id)
            );
        } else {
            setFavoriteIds((prev) => [...prev, exercise.id]);
            setFavoriteExercises((prev) => [...prev, exercise]);
        }
        try {
            if (isFav) {
                await deleteFavoriteExercise(exercise.id);
            } else {
                await createFavoriteExercise(exercise.id);
            }
        } catch (error) {
            // rollback
            if (isFav) {
                setFavoriteIds((prev) => [...prev, exercise.id]);
                setFavoriteExercises((prev) => [...prev, exercise]);
            } else {
                setFavoriteIds((prev) =>
                    prev.filter((id) => id !== exercise.id)
                );
                setFavoriteExercises((prev) =>
                    prev.filter((e) => e.id !== exercise.id)
                );

            }
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return {
        favoriteIds,
        favoriteExercises,
        loadingFavorite,
        toggleFavorite,
        fetchFavorites,
    };
};

export default useFavoriteExercise;