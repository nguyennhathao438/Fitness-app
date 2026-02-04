<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MuscleGroup extends Model
{
    protected $fillable = ['name', 'is_main'];

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class);
    }
}

