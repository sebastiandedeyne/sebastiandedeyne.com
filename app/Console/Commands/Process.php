<?php

namespace App\Console\Commands;

use App\Mastodon;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Statamic\Entries\Entry;
use Statamic\Facades\Entry as Entries;
use Statamic\Facades\GlobalSet;
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

        // Remember the last processed entry for the next run
        GlobalSet::findByHandle('state')
            ->inDefaultSite()
            ->set('last_processed_entry', $entriesToProcess->last()->id)
            ->save();

        // Flush the static cache when a post was scheduled
        if ($entriesToProcess->last()->date()->isBefore(Carbon::now()->subHour())) {
            StaticCache::flush();
        }

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
            ->where('date', '>', $processFrom)
            ->get();
    }
}
