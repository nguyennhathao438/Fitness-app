<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
Schema::create('schedule_members', function (Blueprint $table) {
    $table->id();

    $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('schedule_id')->constrained('schedules')->cascadeOnDelete();

    $table->time('start_time');
    $table->time('end_time');

    $table->timestamps();

    // 1 slot chỉ 1 member
    $table->unique('schedule_id');
});


    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_members');
    }
};
