<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WorkoutHistoryDetail extends Model
{
    protected $table = 'workout_history_details';

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }
    public function history()
    {
        return $this->belongsTo(WorkoutHistory::class, 'workout_hitory_id');
    }
}
?>