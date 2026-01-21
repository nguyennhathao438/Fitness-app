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
        'has_pt',
        'is_deleted',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'has_pt' => 'boolean',
        'is_deleted' => 'boolean',
    ];
}
