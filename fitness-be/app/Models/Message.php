<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'message';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'content',
    ];
    /* =====================
       Relationships
    ===================== */
    public function sender(){
        return $this->belongsTo(Member::class, 'sender_id');
    }
    public function receiver(){
        return $this->belongsTo(Member::class, 'receiver_id');
    }
}
