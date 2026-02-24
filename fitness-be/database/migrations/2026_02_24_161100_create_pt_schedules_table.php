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
    Schema::create('pt_schedules', function (Blueprint $table) {
        $table->id();

        $table->foreignId('pt_id')
              ->constrained('members')
              ->cascadeOnDelete();

        $table->foreignId('member_id')
              ->nullable()
              ->constrained('members')
              ->nullOnDelete();

        $table->date('date');
        $table->time('start_time');
        $table->time('end_time');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pt_schedules');
    }
};
