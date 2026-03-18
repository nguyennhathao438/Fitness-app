<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkoutHistory extends Model
{
    use HasFactory;

    protected $table = 'workout_history';

    protected $fillable = [
        'member_id',
        'total_time',
        'date',
        'day_of_week',
        'completion_percentage',
    ];

    protected $casts = [
        'date' => 'date',
        'total_time' => 'integer',
        'completion_percentage' => 'float',
    ];

    /* ================= RELATIONSHIPS ================= */

    // 1 workout thuộc 1 member
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    // 1 workout có nhiều detail
    public function details()
    {
        return $this->hasMany(WorkoutHistoryDetail::class);
    }

    /* ================= BUSINESS LOGIC ================= */

    // Tính lại % hoàn thành
    public function calculateCompletionPercentage()
    {
        $total = $this->details()->count();

        if ($total === 0) {
            return 0;
        }

        $completed = $this->details()
            ->where('status', 'completed')
            ->count();

        return round(($completed / $total) * 100, 2);
    }
}