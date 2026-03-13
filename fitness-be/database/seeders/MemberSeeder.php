<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('members')->insert([
            // ADMIN
            [
                'name' => 'Admin',
                'email' => 'admin@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000000',
                'gender' => 'other',
                'birthday' => '1990-01-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // USERS (30)
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'a@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000001',
                'gender' => 'male',
                'birthday' => '1998-02-10',
                'created_at' => Carbon::create(2026, 1, 1)
                ->addDays(rand(0, 364))
                ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'b@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000002',
                'gender' => 'female',
                'birthday' => '1999-05-12',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Lê Văn C',
                'email' => 'c@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000003',
                'gender' => 'male',
                'birthday' => '1997-07-20',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Phạm Thị D',
                'email' => 'd@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000004',
                'gender' => 'female',
                'birthday' => '2000-03-08',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hoàng Văn E',
                'email' => 'e@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000005',
                'gender' => 'male',
                'birthday' => '1996-11-15',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Vũ Thị F',
                'email' => 'f@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000006',
                'gender' => 'female',
                'birthday' => '1995-09-01',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Đặng Văn G',
                'email' => 'g@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000007',
                'gender' => 'male',
                'birthday' => '1998-12-22',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Bùi Thị H',
                'email' => 'h@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000008',
                'gender' => 'female',
                'birthday' => '2001-06-18',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Phan Văn I',
                'email' => 'i@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000009',
                'gender' => 'male',
                'birthday' => '1997-04-25',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Mai Thị K',
                'email' => 'k@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000010',
                'gender' => 'female',
                'birthday' => '1999-08-09',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Ngô Văn L',
                'email' => 'l@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000011',
                'gender' => 'male',
                'birthday' => '1996-10-30',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Tạ Thị M',
                'email' => 'm@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000012',
                'gender' => 'female',
                'birthday' => '2002-01-14',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Đinh Văn N',
                'email' => 'n@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000013',
                'gender' => 'male',
                'birthday' => '1995-02-02',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Lý Thị O',
                'email' => 'o@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000014',
                'gender' => 'female',
                'birthday' => '1998-05-05',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hồ Văn P',
                'email' => 'p@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000015',
                'gender' => 'male',
                'birthday' => '1997-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Tào Thị L',
                'email' => 'L1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000016',
                'gender' => 'male',
                'birthday' => '1997-02-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Xung Văn P',
                'email' => 'p1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000017',
                'gender' => 'other',
                'birthday' => '1992-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Xung Văn H',
                'email' => 'h1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000018',
                'gender' => 'male',
                'birthday' => '1982-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Phan Tầm T',
                'email' => 'T1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000019',
                'gender' => 'female',
                'birthday' => '2002-09-09',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hùng Tú A',
                'email' => 'TA1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000020',
                'gender' => 'male',
                'birthday' => '1995-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Mai Tú Y',
                'email' => 'Y1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000021',
                'gender' => 'female',
                'birthday' => '1998-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Lâm Ngọc C',
                'email' => 'CN1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000022',
                'gender' => 'female',
                'birthday' => '1997-10-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hàn Lý K',
                'email' => 'K1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000023',
                'gender' => 'male',
                'birthday' => '2005-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Mạc Lý U',
                'email' => 'UL1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000024',
                'gender' => 'male',
                'birthday' => '2009-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hàn Thần K',
                'email' => 'TK1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000025',
                'gender' => 'male',
                'birthday' => '2005-11-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Nguyễn Mai K',
                'email' => 'MK1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000026',
                'gender' => 'other',
                'birthday' => '2002-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Sang Nhị T',
                'email' => 'NT1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000027',
                'gender' => 'other',
                'birthday' => '1985-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Bàn Mai Văn K',
                'email' => 'BK1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000028',
                'gender' => 'female',
                'birthday' => '2007-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
            [
                'name' => 'Hồ Lý P',
                'email' => 'HP1@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000029',
                'gender' => 'female',
                'birthday' => '1988-09-19',
                'created_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
                'updated_at' => Carbon::create(2026, 1, 1)
    ->addDays(rand(0, 364))
    ->addSeconds(rand(0, 86400)),
            ],
        ]);
    }
}
