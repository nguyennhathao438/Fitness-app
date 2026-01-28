<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pt_clients', function (Blueprint $table) {
            $table->id();

            // PT là user (role = pt)
            $table->foreignId('pt_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();

            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->date('start_date');
            $table->date('end_date');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pt_clients');
    }
};
