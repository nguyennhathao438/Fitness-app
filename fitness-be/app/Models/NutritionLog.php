<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionLog extends Model
{
    protected $fillable = [
        'member_id',
        'meal_name',
        'calories',
        'meal_date',
        'meal_time',
        'image_url',
        'source',
        'note',
    ];

    protected $casts = [
        'meal_date' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}