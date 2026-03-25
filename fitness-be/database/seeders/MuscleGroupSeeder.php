<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class MuscleGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('muscle_groups')->insert([
            ['name' => 'Ngực', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Lưng xô', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Lưng dưới', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Vai trước', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Vai giữa', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Vai sau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tay trước', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tay sau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cẳng tay', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bụng', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cơ xiên bụng', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mông', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Đùi trước', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Đùi sau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bắp chân', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Toàn thân', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
