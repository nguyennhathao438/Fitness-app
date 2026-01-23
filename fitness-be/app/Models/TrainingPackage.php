<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class TrainingPackage extends Model
{
    use HasFactory;

    protected $table = 'training_packages';

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'package_type_id',
        'is_deleted',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_deleted' => 'boolean',
    ];
    public function packageType()
    {
        return $this->belongsTo(PackageType::class);
    }
}
