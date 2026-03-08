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
        Schema::create('message', function (Blueprint $table) {
            $table->id();
            // khóa ngoại
            $table->foreignId('sender_id')
                ->constrained('members')
                ->cascadeOnDelete();

            $table->foreignId('receiver_id')
                ->constrained('members')
                ->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
            $table->index(['sender_id', 'receiver_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message');
    }
};
