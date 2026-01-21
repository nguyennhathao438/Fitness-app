<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'member_id',
        'package_id',
        'payment_method'
    ];

    protected $casts = [
        'member_id' => 'integer',
        'package_id' => 'integer',
    ];

    /* =====================
       Relationships
    ===================== */

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function package()
    {
        // đổi nếu model của bạn là TrainingPackage
        return $this->belongsTo(TrainingPackage::class, 'package_id');
    }
}
