<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Seed the application's default user account.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'makingproteins@example.com'],
            [
                'name' => 'Making Proteins Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
