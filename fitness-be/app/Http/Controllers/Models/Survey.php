<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'target_type',
    ];

    public function trainingTimes()
    {
        return $this->hasMany(SurveyTrainingTime::class, 'survey_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
