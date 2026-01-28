<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
     use HasFactory;
    protected $fillable = [
        'pt_id',
        'start_time',
        'end_time',
        'day_of_week',
        'pt_attendance_status'
    ];

    public function booking()
    {
        return $this->hasOne(ScheduleMember::class);
    }

}


