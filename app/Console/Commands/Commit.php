<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class Commit extends Command
{
    protected $signature = 'commit';

    public function handle()
    {
        $hasChanges = ! empty(Process::run('git status -s')->output());

        if (! $hasChanges) {
            return;
        }

        Process::run('git add --all && git commit -m "Content updates" && git push');
    }
}
