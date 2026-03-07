<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkoutHistoryDetail extends Model
{
    use HasFactory;

    protected $table = 'workout_history_detail';

    protected $fillable = [
        'workout_history_id',
        'exercise_id',
        'set_count',
        'rep',
        'execution_time',
        'estimated_time',
        'status',
        'completion_percentage', // thêm dòng này
    ];

    protected $casts = [
        'set_count' => 'integer',
        'rep' => 'integer',
        'execution_time' => 'integer',
        'estimated_time' => 'integer',
        'completion_percentage' => 'integer', // thêm dòng này
    ];

    public function workoutHistory()
    {
        return $this->belongsTo(WorkoutHistory::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}