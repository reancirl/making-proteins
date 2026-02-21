<?php

use App\Http\Controllers\CardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('cards', CardController::class)->except(['show']);
    Route::get('cards/{card}/qr', [CardController::class, 'qrPreview'])->name('cards.qr');
    Route::get('cards/{card}/qr-image', [CardController::class, 'qrImage'])->name('cards.qr-image');
});

Route::get('cards/public/{card:uuid}', [CardController::class, 'publicShow'])->name('cards.public');
Route::get('cards/public-feed', [CardController::class, 'publicFeed'])->name('cards.public-feed');

require __DIR__.'/settings.php';
