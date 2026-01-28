<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::create('schedules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('pt_id')->constrained('users')->cascadeOnDelete();
    $table->time('start_time');
    $table->time('end_time');
    $table->tinyInteger('day_of_week'); // 0=CN ... 6=T7
    $table->boolean('pt_attendance_status')->default(false);
    $table->timestamps();
});

}

public function down(): void
{
    Schema::dropIfExists('schedules');
}

 
};
