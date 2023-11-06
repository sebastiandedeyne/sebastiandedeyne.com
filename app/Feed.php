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
            ->limit(10)
            ->get()
            ->map(function (\Statamic\Entries\Entry $entry) {
                $summary = (string) $entry->augmentedValue('content');

                if ($link = $entry->value('link')) {
                    $domain = parse_url($link)['host'] ?? '';
                    $summary .= sprintf('<p>↗ <a href="%s">%s</a></p>', $link, $domain);
                }

                return FeedItem::create()
                    ->title((string) $entry->augmentedValue('title'))
                    ->id($entry->absoluteUrl())
                    ->summary($summary)
                    ->updated($entry->date())
                    ->link($entry->absoluteUrl())
                    ->authorName('Sebastian De Deyne')
                    ->authorEmail('sebastiandedeyne@gmail.com');
            });
    }
}
