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
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'birthday' => 'date',
        'is_deleted' => 'boolean',
    ];
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'member_role');
    }

    public function hasPermission($permission)
    {
        return $this->roles()
            ->whereHas('permissions', function ($q) use ($permission) {
                $q->where('code', $permission);
            })->exists();
    }
}
