<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
class Member extends Authenticatable
{
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
        'valid_until'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'birthday' => 'date',
        'valid_until' => 'date',
        'is_deleted' => 'boolean',
    ];
}
