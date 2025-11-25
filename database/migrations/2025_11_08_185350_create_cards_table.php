<?php

use App\Models\Card;
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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->enum('type', Card::TYPES);
            $table->string('question', 500);
            $table->text('answer');
            $table->enum('status', Card::STATUSES)->default('draft');
            $table->string('media_path')->nullable();
            $table->string('media_original_name')->nullable();
            $table->string('media_mime')->nullable();
            $table->string('alt_video_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
