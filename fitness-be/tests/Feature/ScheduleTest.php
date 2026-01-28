<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Schedule;
use App\Models\ScheduleMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ScheduleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function pt_can_create_schedule()
    {
        $pt = User::factory()->create([
            'role' => 'pt',
        ]);

        $this->actingAs($pt);

        $response = $this->postJson('/api/schedules', [
            'day_of_week' => 1,
            'start_time'  => '08:00',
            'end_time'    => '09:00',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('schedules', [
            'pt_id' => $pt->id,
            'day_of_week' => 1,
        ]);
    }

    /** @test */
public function pt_can_create_schedule_on_monday_and_saturday()
{
    $pt = User::factory()->create(['role' => 'pt']);
    $this->actingAs($pt, 'sanctum');

    $days = [
        1 => ['07:00', '09:00'], // Thứ 2
        6 => ['14:00', '16:00'], // Thứ 7
    ];

    foreach ($days as $dayOfWeek => [$start, $end]) {
        $response = $this->postJson('/api/schedules', [
            'day_of_week' => $dayOfWeek,
            'start_time'  => $start,
            'end_time'    => $end,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('schedules', [
            'pt_id'      => $pt->id,
            'day_of_week'=> $dayOfWeek,
            'start_time' => $start,
            'end_time'   => $end,
        ]);
    }
}

    /** @test */
    public function member_cannot_create_schedule()
    {
        $member = User::factory()->create([
            'role' => 'member',
        ]);

        $this->actingAs($member);

        $response = $this->postJson('/api/schedules', [
            'day_of_week' => 1,
            'start_time'  => '08:00',
            'end_time'    => '09:00',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function pt_can_view_own_schedules()
    {
        $pt = User::factory()->create(['role' => 'pt']);

        Schedule::factory()->count(2)->create([
            'pt_id' => $pt->id,
        ]);

        $this->actingAs($pt);

        $response = $this->getJson('/api/schedules');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function member_can_view_available_schedules_of_pt()
    {
        $pt = User::factory()->create(['role' => 'pt']);

        $schedule = Schedule::factory()->create([
            'pt_id' => $pt->id,
            'day_of_week' => 2,
        ]);

        $member = User::factory()->create(['role' => 'member']);

        $this->actingAs($member);

        $response = $this->getJson('/api/schedules/available?pt_id=' . $pt->id . '&day_of_week=2');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $schedule->id,
                 ]);
    }

    /** @test */
    public function member_can_book_schedule()
    {
        $pt = User::factory()->create(['role' => 'pt']);
        $member = User::factory()->create(['role' => 'member']);

        $schedule = Schedule::factory()->create([
            'pt_id' => $pt->id,
        ]);

        $this->actingAs($member);

        $response = $this->postJson('/api/schedules/' . $schedule->id . '/book');

        $response->assertStatus(200);

        $this->assertDatabaseHas('schedule_members', [
            'schedule_id' => $schedule->id,
            'member_id'   => $member->id,
        ]);
    }

    /** @test */
    public function cannot_book_already_booked_schedule()
    {
        $pt = User::factory()->create(['role' => 'pt']);
        $member1 = User::factory()->create(['role' => 'member']);
        $member2 = User::factory()->create(['role' => 'member']);

        $schedule = Schedule::factory()->create([
            'pt_id' => $pt->id,
        ]);
$member = User::factory()->create(['role' => 'member']);

       ScheduleMember::create([
    'schedule_id' => $schedule->id,
   'member_id' => $member->id,

    'start_time' => $schedule->start_time,
    'end_time' => $schedule->end_time,
]);


        $this->actingAs($member2);

        $response = $this->postJson('/api/schedules/' . $schedule->id . '/book');

        $response->assertStatus(400);
    }
    /** @test */
public function two_members_cannot_book_same_schedule_on_monday_7_to_9()
{
    // Arrange
    $pt = User::factory()->create(['role' => 'pt']);

    $schedule = Schedule::factory()->create([
        'pt_id' => $pt->id,
        'day_of_week' => 1,       // Thứ 2
        'start_time' => '07:00',
        'end_time' => '09:00',
    ]);

    $member1 = User::factory()->create(['role' => 'member']);
    $member2 = User::factory()->create(['role' => 'member']);

    // Member 1 đặt lịch thành công
    $this->actingAs($member1, 'sanctum')
        ->postJson("/api/schedules/{$schedule->id}/book")
        ->assertStatus(200);

    // Act + Assert
    // Member 2 cố đặt cùng khung giờ → bị chặn
    $this->actingAs($member2, 'sanctum')
        ->postJson("/api/schedules/{$schedule->id}/book")
        ->assertStatus(400)
        ->assertJson([
            'message' => 'Slot đã được đặt'
        ]);

    // Đảm bảo chỉ có 1 booking trong DB
    $this->assertDatabaseCount('schedule_members', 1);
}

}
