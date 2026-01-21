<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('survey_training_times', function (Blueprint $table) {
            $table->id();

            $table->foreignId('survey_id')
                ->constrained('surveys')
                ->cascadeOnDelete();

            $table->string('day_of_week');   // Mon, Tue, Wed...
            $table->string('time_slot');     //Early Morning, Morning, Afternoon, Evening
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_training_times');
    }
};
