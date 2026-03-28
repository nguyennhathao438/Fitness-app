<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionLog extends Model
{
    protected $fillable = [
        'member_id',
        'meal_name',
        'calories',
        'quantity',
        'unit',
        'meal_date',
        'meal_time',
        'image_url',
        'source',
        'note',
    ];

    protected $casts = [
        'meal_date' => 'date',
        'quantity' => 'decimal:2',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}