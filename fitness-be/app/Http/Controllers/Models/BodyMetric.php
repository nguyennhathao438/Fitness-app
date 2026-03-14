<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BodyMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'weight',
        'height',
        'muscle',
        'body_fat',
        'visceral_fat',
        'body_water',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

}