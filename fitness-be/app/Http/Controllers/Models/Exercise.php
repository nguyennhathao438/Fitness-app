<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $table = 'exercises'; // có thể bỏ, Laravel tự hiểu

    protected $fillable = [
        'name',
        'rep_base',
        'set_base',
        'description',
        'video',
        'time_action',
    ];

    public function muscleGroups()
    {
        return $this->belongsToMany(MuscleGroup::class);
    }
}
