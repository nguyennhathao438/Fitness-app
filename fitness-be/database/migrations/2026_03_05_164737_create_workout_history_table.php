<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_history', function (Blueprint $table) {
            $table->id();

            // Người tập
            $table->foreignId('member_id')
                  ->constrained('members')
                  ->onDelete('cascade');

            // Tổng thời gian tập (giây)
            $table->integer('total_time')->default(0);

            // Ngày tập
            $table->date('date');

            // Thứ trong tuần (VD: 1-7 hoặc text)
            $table->string('day_of_week', 20);

            // % hoàn thành (0-100)
            $table->decimal('completion_percentage', 5, 2)
                  ->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_history');
    }
};
