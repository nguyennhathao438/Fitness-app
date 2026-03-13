<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PTSchedule;
use App\Models\Notification;
use Carbon\Carbon;
class SendScheduleReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-schedule-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
{
    $now = Carbon::now();
    $targetTime = $now->copy()->addMinutes(30);

    $schedules = PTSchedule::whereNull('reminder_sent')
        ->get();

    foreach ($schedules as $schedule) {

        $scheduleTime = Carbon::parse($schedule->date . ' ' . $schedule->start_time);

        if ($scheduleTime->between($now, $targetTime)) {

            // gửi cho member
            if ($schedule->member_id) {
                Notification::create([
                    'user_id' => $schedule->member_id,
                    'sender_id' => $schedule->pt_id,
                    'type' => 'schedule_reminder',
                    'title' => 'Nhắc lịch tập',
                    'message' => 'Bạn có lịch tập sắp tới',
                    'data' => [
                        'schedule_id' => $schedule->id,
                        'date' => $schedule->date,
                        'time' => $schedule->start_time
                    ]
                ]);
            }

            // gửi cho PT
            Notification::create([
                'user_id' => $schedule->pt_id,
                'sender_id' => null,
                'type' => 'schedule_reminder',
                'title' => 'Nhắc lịch tập',
                'message' => 'Bạn có lịch tập sắp tới',
                'data' => [
                    'schedule_id' => $schedule->id
                ]
            ]);

            $schedule->update([
                'reminder_sent' => true
            ]);
        }
    }
}
}
