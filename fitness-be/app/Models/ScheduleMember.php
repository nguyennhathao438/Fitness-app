<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleMember extends Model
{
    protected $fillable = [
        'member_id',
        'schedule_id',
        'start_time',
        'end_time'
    ];
}
