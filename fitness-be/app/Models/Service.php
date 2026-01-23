<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Service extends Model
{
    protected $fillable = ['name'];

    public function packageTypes()
    {
        return $this->belongsToMany(PackageType::class, 'type_service');
    }
}
