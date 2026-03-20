<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteExercise extends Model
{
    protected $table = 'favorite_exercises';

    protected $fillable = [
        'member_id',
        'exercise_id'
    ];

    /**
     * Member sở hữu favorite này
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Exercise được yêu thích
     */
    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
