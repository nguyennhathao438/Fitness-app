<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyTrainingTime extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'day_of_week',
        'time_slot',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }
}
