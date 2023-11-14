<?php

namespace App;

use Illuminate\Support\Facades\Http;
use Statamic\Entries\Entry;

class Mastodon
{
    public function enabled(): bool
    {
        if (app()->environment('local')) {
            return false;
        }

        return ! empty(config('services.mastodon.token'));
    }

    public function post(Entry $entry)
    {
        $status = implode(' ', [
            $entry->link ? '' : '✍️ ',
            $entry->social_post ?: $entry->title,
            $entry->social_always_link_to_blog
                ? $entry->absoluteUrl()
                : ($entry->link ?: $entry->absoluteUrl()),
        ]);

        Http::withToken(config('services.mastodon.token'))
            ->baseUrl(config('services.mastodon.url'))
            ->post('/statuses', [
                'status' => $status,
            ]);
    }
}
