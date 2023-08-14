<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use League\CommonMark\Extension\Attributes\AttributesExtension;
use Statamic\Facades\Markdown;
use Statamic\Statamic;
use Torchlight\Commonmark\V2\TorchlightExtension;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Statamic::vite('app', [
            'resources/css/cp.css'
        ]);

        Markdown::addExtension(function () {
            return [
                new TorchlightExtension(),
            ];
        });
    }
}
