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
        $receptionist = Role::where('name', 'Receptionist')->first();

        if (!$admin || !$pt || !$receptionist) {
            throw new \Exception('Role chưa tồn tại');
        }

        // đảm bảo permission tồn tại
        if (Permission::count() === 0) {
            throw new \Exception('Permission chưa được seed');
        }

        // ADMIN
        $admin->permissions()->sync(
            Permission::pluck('id')->toArray()
        );

        // PT
        $pt->permissions()->sync(
            Permission::whereIn('code', [
                'user.read',
                'service.read',
                'invoice.read',
                'invoice.update',
            ])->pluck('id')->toArray()
        );

        // RECEPTIONIST
        $receptionist->permissions()->sync(
            Permission::whereIn('code', [
                'user.read',
                'user.create',
                'service.read',
                'invoice.read',
                'invoice.create',
            ])->pluck('id')->toArray()
        );
    }
}
