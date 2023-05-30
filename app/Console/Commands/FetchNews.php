<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\NewsController;


class FetchNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-news';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and store news articles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $newsController = new NewsController();
        $newsController->fetchAndStoreNews();
        $this->info('News fetched and stored successfully');
    }
}
