<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ptclients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pt_id');
            $table->unsignedBigInteger('member_id');
            $table->string('status')->default('active');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ptclients');
    }
};
