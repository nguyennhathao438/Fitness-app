<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WorkoutHistory extends Model
{
    protected $table = 'workout_history';

    public function details()
    {
        return $this->hasMany(WorkoutHistoryDetail::class, 'workout_hitory_id');
    }
}
?>