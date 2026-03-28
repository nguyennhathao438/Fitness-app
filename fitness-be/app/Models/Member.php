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
    public function latestInvoice()
    {
        return $this->hasOne(Invoice::class)
            ->where('status', 'paid')
            ->where('is_deleted', false)
            ->orderByDesc('valid_until');
    }
    public function ptClientsAsPT()
    {
        return $this->hasMany(PersonalTrainerClient::class, 'pt_id');
    }

    public function ptClientsAsMember()
    {
        return $this->hasMany(PersonalTrainerClient::class, 'member_id');
    }
    public function activept()
    {
        return $this->hasOne(PersonalTrainerClient::class, 'member_id')
            ->where('status', 'active');
    }
    public function bodyMetrics()
    {
        return $this->hasMany(BodyMetric::class);
    }

    public function managedMembers()
    {
        return $this->belongsToMany(
            Member::class,
            'pt_clients',
            'pt_id',
            'member_id'
        );
    }

    public function pt()
    {
        return $this->belongsToMany(
            Member::class,
            'pt_clients',
            'member_id',
            'pt_id'
        );
    }

    public function favorites()
    {
        return $this->belongsToMany(
            Exercise::class,
            'favorite_exercises',
            'member_id',
            'exercise_id'
        );
    }

    public function ptSchedules()
    {
        return $this->hasMany(PTSchedule::class, 'pt_id');
    }
    public function nutritionLogs()
    {
        return $this->hasMany(NutritionLog::class, 'member_id');
    }
}
