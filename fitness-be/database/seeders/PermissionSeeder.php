<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [

            'user' => ['create', 'read', 'update', 'delete'],
            'package' => ['create', 'read', 'update', 'delete'],
            'invoice' => ['read', 'update', 'delete'],
            'permission' => ['create', 'read', 'update', 'delete'],
            'message_admin' => ['create', 'read'],
            'message_pt' => ['create', 'read'],
            'message_user' => ['create', 'read'],
            'workout' => ['create', 'read'],
            'schedule_pt' => ['create', 'read', 'update', 'delete'],
            'schedule_user' => ['create', 'read'],
            'member' => ['read'],
            'exercise' => ['create', 'read', 'update', 'delete'],
            'statistic' => ['read'],

        ];

        foreach ($modules as $module => $actions) {

            foreach ($actions as $action) {

                Permission::updateOrCreate(
                    [
                        'code' => $module . '.' . $action,
                    ],
                    [
                        'action' => $action,
                        'name' => strtoupper($module) . ' ' . strtoupper($action),
                    ]
                );

            }
        }
    }
}
