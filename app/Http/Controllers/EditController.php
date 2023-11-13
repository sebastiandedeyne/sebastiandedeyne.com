<?php

namespace App\Http\Controllers;

use Statamic\Facades\Entry;

class EditController
{
    public function __invoke(string $slug)
    {
        $entry = Entry::query()->where('slug', $slug)->first();

        if (! $entry) {
            abort(404);
        }

        return redirect()->to('/cp/collections/posts/entries/' . $entry->id);
    }
}
