<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;

class StatsController
{
    public function __invoke()
    {
        return Cache::remember('stats', 60 * 60 * 12, function () {
            $firstEntry = Entry::query()
                ->where('collection', 'posts')
                ->where('published', true)
                ->where('date', '<=', now())
                ->orderBy('date')
                ->first();

            $from = CarbonImmutable::make($firstEntry->date())->startOfMonth();

            $entries = [];

            while ($from->isPast()) {
                $to = $from->addMonthNoOverflow();

                $entriesOnDay = Entry::query()
                    ->where('collection', 'posts')
                    ->where('published', true)
                    ->where('date', '>=', $from)
                    ->where('date', '<', $to)
                    ->orderBy('date')
                    ->get();

                $entries[] = [
                    'date' => $from->toDateString(),
                    'articles' => $entriesOnDay
                        ->filter(function (\Statamic\Entries\Entry $entry) {
                            return empty($entry->value('link'));
                        })
                        ->count(),
                    'links' => $entriesOnDay
                        ->filter(function (\Statamic\Entries\Entry $entry) {
                            return ! empty($entry->value('link'));
                        })
                        ->count(),
                ];

                $from = $to;
            }

            return ['posts_per_month' => $entries];
        });
    }
}
