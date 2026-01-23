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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->foreignId('member_id')
                ->constrained('members')
                ->onDelete('cascade');

            $table->foreignId('package_id')
                ->constrained('training_packages')
                ->onDelete('cascade');

            $table->enum('payment_method', ['momo', 'vnpay', 'cash']);
            $table->date('valid_until')->nullable();
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
