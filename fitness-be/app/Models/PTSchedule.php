<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PTSchedule extends Model
{
    protected $table = 'pt_schedules';
    protected $fillable = [
        'pt_id',
        'member_id',
        'date',
        'start_time',
        'end_time'
    ];

    public function pt()
    {
        return $this->belongsTo(Member::class, 'pt_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}