<?php

namespace App;

use Illuminate\Support\Collection;
use Spatie\Feed\FeedItem;
use Statamic\Facades\Entry;
use Statamic\Stache\Query\EntryQueryBuilder;

class Feed
{
    public function all(): Collection
    {
        return $this->feed();
    }

    public function articles(): Collection
    {
        return $this->feed(fn (EntryQueryBuilder $query) => $query->where('link', null));
    }

    private function feed(callable $filter = null): Collection
    {
        /** @var EntryQueryBuilder $query */
        $query = $filter ? $filter(Entry::query()) : Entry::query();

        return $query
            ->where('collection', 'posts')
            ->where('published', true)
            ->where('date', '<=', now())
            ->orderBy('date', 'desc')
            ->get()
            ->map(function (\Statamic\Entries\Entry $entry) {
                return FeedItem::create()
                    ->title(mb_convert_encoding((string) $entry->augmentedValue('title'), 'UTF-8', 'HTML-ENTITIES'))
                    ->id($entry->absoluteUrl())
                    ->summary(mb_convert_encoding((string) $entry->augmentedValue('content'), 'UTF-8', 'HTML-ENTITIES'))
                    ->updated($entry->date())
                    ->link($entry->absoluteUrl())
                    ->authorName('Sebastian De Deyne')
                    ->authorEmail('sebastiandedeyne@gmail.com');
            });
    }
}
