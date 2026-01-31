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
        Schema::create('body_metrics', function (Blueprint $table) {
            $table->id(); // id

            $table->foreignId('member_id')
                ->constrained('members')
                ->onDelete('cascade');

            $table->float('weight')->nullable();
            $table->float('height')->nullable();
            $table->float('muscle')->nullable();
            $table->float('body_fat')->nullable();
            $table->float('visceral_fat')->nullable();
            $table->float('body_water')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('body_metrics');
    }
};