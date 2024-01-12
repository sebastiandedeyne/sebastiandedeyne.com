<?php

namespace App\Providers;

use App\Http\Controllers\EditController;
use App\Http\Controllers\StatsController;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->routes(function () {
            Route::middleware('web')->group(function () {
                Route::get('{slug}/edit', EditController::class);
                Route::get('links/{slug}/edit', EditController::class);

                Route::get('stats.json', StatsController::class);

                Route::feeds();
            });
        });
    }
}
