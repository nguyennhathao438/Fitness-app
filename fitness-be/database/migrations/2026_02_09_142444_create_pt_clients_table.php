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
        Schema::create('pt_clients', function (Blueprint $table) {
            $table->id();

            // khóa ngoại
            $table->foreignId('pt_id')
                ->constrained('members')
                ->cascadeOnDelete();

            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();

            // thời gian tập
            $table->date('start_date');
            $table->date('end_date')->nullable();

            // trạng thái
            $table->enum('status', ['active', 'expired','cancel']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pt_clients');
    }
};
