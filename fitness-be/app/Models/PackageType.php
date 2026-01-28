<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 
use App\Models\TrainingPackage;
use App\Models\Service;

class PackageType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function trainingPackages()
    {
        return $this->hasMany(TrainingPackage::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'type_service');
    }
}
