<?php

namespace App\Console\Commands;

use App\Mastodon;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Statamic\Entries\Entry;
use Statamic\Facades\Entry as Entries;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Stache;
use Statamic\Facades\StaticCache;

class Process extends Command
{
    protected $signature = 'process';

    public function handle(Mastodon $mastodon)
    {
        $entriesToProcess = $this->collectEntriesToProcess();

        if ($entriesToProcess->isEmpty()) {
            return;
        }

        // Warm the stash & flush the static cache
        Stache::warm();
        StaticCache::flush();
        Cache::forget('stats');

        // Remember the last processed entry for the next run
        GlobalSet::findByHandle('state')
            ->inDefaultSite()
            ->set('last_processed_entry', $entriesToProcess->last()->id)
            ->save();

        // Toot latest entries
        if ($mastodon->enabled()) {
            $entriesToProcess
                ->reverse()
                ->limit(3)
                ->each(fn (Entry $entry) => $mastodon->post($entry));
        }
    }

    private function collectEntriesToProcess(): Collection
    {
        $lastProcessedEntryId = GlobalSet::findByHandle('state')
            ->inDefaultSite()
            ->get('last_processed_entry');

        $processFrom = Entries::find($lastProcessedEntryId)?->date()
            ?? Carbon::now()->subDay();

        return Entries::query()
            ->where('collection', 'posts')
            ->where('published', true)
            ->where('date', '<=', Carbon::now())
            ->where('date', '>', $processFrom)
            ->get();
    }
}
