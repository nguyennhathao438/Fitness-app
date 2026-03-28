<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_logs', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('member_id');

            $table->string('meal_name');
            $table->integer('calories')->default(0);

            // Thêm định lượng
            $table->decimal('quantity', 8, 2)->nullable();
            $table->string('unit', 50)->nullable();

            $table->date('meal_date');
            $table->time('meal_time')->nullable();

            $table->string('image_url')->nullable();
            $table->enum('source', ['manual', 'ai', 'schedule', 'recent'])->default('manual');
            $table->text('note')->nullable();

            $table->timestamps();

            $table->foreign('member_id')
                ->references('id')
                ->on('members')
                ->onDelete('cascade');

            $table->index(['member_id', 'meal_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_logs');
    }
};