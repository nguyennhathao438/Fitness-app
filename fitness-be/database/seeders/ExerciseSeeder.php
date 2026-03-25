<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('exercises')->insert([
            [
                'name' => 'Barbell Bench Press',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Bài đẩy ngực với thanh đòn',
                'video' => 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Incline Dumbbell Press',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Đẩy ngực trên với tạ đơn',
                'video' => 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Pull Up',
                'rep_base' => 8,
                'set_base' => 4,
                'description' => 'Hít xà đơn',
                'video' => 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Lat Pulldown',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Kéo xô với máy',
                'video' => 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Barbell Row',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Kéo lưng với thanh đòn',
                'video' => 'https://www.youtube.com/watch?v=vT2GjY_Umpw',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Shoulder Press',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Đẩy vai với tạ',
                'video' => 'https://www.youtube.com/watch?v=qEwKCR5JCog',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Lateral Raise',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Nâng tạ ngang vai',
                'video' => 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Barbell Curl',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Cuốn tay trước với thanh đòn',
                'video' => 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tricep Pushdown',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Đẩy cáp tay sau',
                'video' => 'https://www.youtube.com/watch?v=2-LAMcpzODU',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Squat',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Squat với thanh đòn',
                'video' => 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Romanian Deadlift',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Deadlift đùi sau và mông',
                'video' => 'https://www.youtube.com/watch?v=2SHsk9AzdjA',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Plank',
                'rep_base' => null,
                'set_base' => 3,
                'description' => 'Giữ cơ bụng',
                'video' => 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
                'time_action' => 60,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
