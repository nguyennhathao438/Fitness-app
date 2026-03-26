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

        if (!$admin || !$pt || !$memberVip || !$member) {
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

                'user.read',

                'package.read',

                'invoice.read',
                'invoice.update',

                'message_pt.create',
                'message_pt.read',

                'workout.create',
                'workout.read',

                'schedule_pt.read',
                'schedule_pt.update',

                'member.read',

                'exercise.read',

                'statistic.read',

            ])->pluck('id')->toArray()
        );


        // ✅ Member
        $member->permissions()->sync(
            Permission::whereIn('code', [
                'workout.read',
                'workout.create',
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
