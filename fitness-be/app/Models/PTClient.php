<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PTClient extends Model
{
    protected $table = 'ptclients';

    protected $fillable = [
        'pt_id',
        'member_id',
        'start_date',
        'end_date',
        'status',
    ];


    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
