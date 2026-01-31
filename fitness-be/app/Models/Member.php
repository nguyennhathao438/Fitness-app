<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
class Member extends Authenticatable
{
    protected $appends = ['age'];
    public function getAgeAttribute()
    {
        return Carbon::parse($this->birthday)->age;
    }
    use HasApiTokens;
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'birthday',
        'gender',
        'avatar',
        'is_deleted',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'birthday' => 'date',
        'is_deleted' => 'boolean',
    ];
}
