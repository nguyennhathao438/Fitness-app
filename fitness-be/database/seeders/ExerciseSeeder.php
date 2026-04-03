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
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774846512/bbpxz8edxwyyngyeplc2.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Incline Dumbbell Press',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Đẩy ngực trên với tạ đơn',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602538/gl1elg7weswrpaszakat.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Pull Up',
                'rep_base' => 8,
                'set_base' => 4,
                'description' => 'Hít xà đơn',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602494/qktxbxhfksqywug4sqav.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Lat Pulldown',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Kéo xô với máy',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602272/ka9zfd2u00t8uc2fcihr.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Barbell Row',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Kéo lưng với thanh đòn',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602290/sxn4qujdowhvjt2szsa5.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Shoulder Press',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Đẩy vai với tạ',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602736/vquy0xjzqhsh4x7sr4qm.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Lateral Raise',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Nâng tạ ngang vai',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774602900/j5qulbxhb2bofr57fuur.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Barbell Curl',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Cuốn tay trước với thanh đòn',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774603156/mcc0mszdaooavencyaal.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tricep Pushdown',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Đẩy cáp tay sau',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774603318/wwkwsquqiq5i8knrpjps.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Squat',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Squat với thanh đòn',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774608881/hnh1abjeogc3yv6xmseh.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Romanian Deadlift',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Deadlift đùi sau và mông',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774609223/ornrb7mweoinqnogi8lg.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Plank',
                'rep_base' => null,
                'set_base' => 3,
                'description' => 'Giữ cơ bụng',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1774609981/vwkulv5jlfl3esdyf4gs.mp4',
                'time_action' => 60,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Ab Roller',
                'rep_base' => 10,
                'set_base' => 4,
                'description' => 'Quỳ gối, siết bụng, lăn con lăn ra trước giữ lưng thẳng rồi dùng cơ bụng kéo về.',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1775146663/zhpcxxrcyhcedcryvf5p.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Leg Press',
                'rep_base' => 12,
                'set_base' => 3,
                'description' => 'Ngồi vào máy, đặt chân lên bàn đạp, hạ tạ xuống bằng cách gập gối rồi dùng lực chân đẩy lên lại nhưng không khóa khớp gối.',
                'video' => 'https://res.cloudinary.com/dcmko66fp/video/upload/v1775147000/bcfisxspiuunxqorqo7e.mp4',
                'time_action' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
