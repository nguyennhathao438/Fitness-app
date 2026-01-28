<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition()
    {
        return [
            'pt_id' => User::factory(),
            'day_of_week' => $this->faker->numberBetween(0, 6),
            'start_time' => '08:00',
            'end_time' => '09:00',
        ];
    }
}
