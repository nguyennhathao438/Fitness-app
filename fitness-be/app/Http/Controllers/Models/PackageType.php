<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class PackageType extends Model
{
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
