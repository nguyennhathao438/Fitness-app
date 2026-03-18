<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_history_detail', function (Blueprint $table) {
            $table->id();

            // Liên kết workout_history
            $table->foreignId('workout_history_id')
                ->constrained('workout_history')
                ->cascadeOnDelete();

            // Liên kết exercise
            $table->foreignId('exercise_id')
                ->constrained('exercises')
                ->cascadeOnDelete();

            // Tổng số set của bài tập
            $table->integer('set_count')->default(0);

            // Số rep mỗi set
            $table->integer('rep')->nullable();

            // Thời gian thực tế thực hiện (giây)
            $table->integer('execution_time')->default(0);

            // Thời gian dự kiến (giây)
            $table->integer('estimated_time')->default(0);

            // % hoàn thành của bài tập
            $table->integer('completion_percentage')->default(0);

            // Trạng thái: pending / in_progress / completed / skipped
            $table->string('status', 20)->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_history_detail');
    }
};