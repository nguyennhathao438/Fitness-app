<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::where('name', 'Admin')->first();
        $pt = Role::where('name', 'PT')->first();
        $memberVip = Role::where('name', 'MemberVip')->first();
        $member = Role::where('name', 'Member')->first();
        $memberUp = Role::where('name', 'MemberUp')->first();

        if (!$admin || !$pt || !$memberVip || !$member || !$memberUp) {
            throw new \Exception('Role chưa tồn tại');
        }

        if (Permission::count() === 0) {
            throw new \Exception('Permission chưa seed');
        }

        // ✅ ADMIN = tất cả
        $admin->permissions()->sync(
            Permission::pluck('id')->toArray()
        );

        // ✅ PT
        $pt->permissions()->sync(
            Permission::whereIn('code', [

                'message_pt.create',
                'message_pt.read',

                'schedule_pt.read',
                'schedule_pt.update',
                'schedule_pt.create',
                'schedule_pt.delete',

                'member.read',

                'exercise.read',
                'exercise.update',
                'exercise.delete',
                'exercise.create',

            ])->pluck('id')->toArray()
        );


        //  Member
        $member->permissions()->sync(
            Permission::whereIn('code', [
                'workout.read',
                'nutrition.read',
            ])->pluck('id')->toArray()
        );
        $memberUp->permissions()->sync(
            Permission::whereIn('code', [
                'workout.create',
                'nutrition.create',
            ])->pluck('id')->toArray()
        );
        $memberVip->permissions()->sync(
            Permission::whereIn('code', [

                'message_user.create',
                'message_user.read',

                'schedule_user.read',
                'schedule_user.create',

            ])->pluck('id')->toArray()
        );
    }
}
