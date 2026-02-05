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
        'payment_method',
        'status',
        'valid_until',
        'is_deleted',
    ];

    protected $casts = [
        'member_id' => 'integer',
        'valid_until' => 'date',
        'package_id' => 'integer',
        'is_deleted' => 'boolean',
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
