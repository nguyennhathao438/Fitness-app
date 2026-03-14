<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalTrainerClient extends Model
{
    use HasFactory;

    protected $table = 'pt_clients';

    protected $fillable = [
        'pt_id',
        'member_id',
        'start_date',
        'end_date',
        'status',
    ];
    // PT (user có role PT)
    public function pt()
    {
        return $this->belongsTo(Member::class, 'pt_id');
    }

    // Member (user có role Member)
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
