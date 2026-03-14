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
    Schema::create('pt_member', function (Blueprint $table) {
        $table->id();

        $table->foreignId('pt_id')
              ->constrained('members')
              ->cascadeOnDelete();

        $table->foreignId('member_id')
              ->constrained('members')
              ->cascadeOnDelete();

        $table->timestamps();

        $table->unique('member_id'); 
        // đảm bảo 1 hội viên chỉ thuộc 1 PT
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pt_member');
    }
};
