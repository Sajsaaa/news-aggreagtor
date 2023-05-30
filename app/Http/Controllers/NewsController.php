<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class NewsController extends Controller
{
    public function fetchAndStoreNews()
    {
        $guardianApiKey = config('app.gardian_api');
        $newsApiKey =config('app.news_org_api');
    
        $topics = ['gaming', 'business','politics','weather','tech','entertainment','health','sports'];
        $today = Carbon::today()->format('Y-m-d');

    
        foreach ($topics as $topic) {
            // Fetch news articles from NewsAPI
            $newsResponse = Http::get("https://newsapi.org/v2/everything", [
                'apiKey' => $newsApiKey,
                'q' => $topic,
                'language' => 'en',
                'pageSize' => 50,
            ]);
    
            // Fetch news articles from Guardian API
            $guardianResponse = Http::get("https://content.guardianapis.com/search", [
                'q' => $topic,
                'from-date' => $today,
                'api-key' => $guardianApiKey,
                'page-size' => 50,
                'show-fields' => 'thumbnail,byline,trailText',
            ]);
    
            if ($newsResponse->successful() && $guardianResponse->successful()) {
                $newsArticles = $newsResponse->json()['articles'];
                $guardianArticles = $guardianResponse->json()['response']['results'];
    
                $articles = array_merge($newsArticles, $guardianArticles);
    
                foreach ($articles as $article) {
                    $source = '';
                    $imageSrc = '';
                    $author = '';
    
                    if (isset($article['source']['name'])) {
                        $source = $article['source']['name'];
                    } elseif (isset($article['sectionName'])) {
                        $source = $article['sectionName'];
                    }
    
                    if (isset($article['urlToImage'])) {
                        $imageSrc = $article['urlToImage'];
                    } elseif (isset($article['fields']['thumbnail'])) {
                        $imageSrc = $article['fields']['thumbnail'];
                    }
    
                    if (isset($article['author'])) {
                        $author = $article['author'];
                    } elseif (isset($article['fields']['byline'])) {
                        $author = $article['fields']['byline'];
                    }
    
                    News::create([
                        'title' => $article['title'] ?? $article['webTitle'],
                        'description' => $article['description'] ?? $article['fields']['trailText'] ?? '',
                        'url' => $article['url'] ?? $article['webUrl'],
                        'published_at' => $article['publishedAt'] ?? $article['webPublicationDate'],
                        'source' => $source,
                        'topic' => $topic,
                        'image_src' => $imageSrc,
                        'author' => $author,
                    ]);
                }
            } else {
                return response()->json(['error' => 'Failed to fetch news for topic: ' . $topic]);
            }
        }
    }
    

    public function getAllNews(Request $request)
    {
        $topic = $request->input('topic');
        $topics = explode(',', $topic);
        $source = $request->input('source');
        $sources = explode(',', $source);
        $author = $request->input('author');
        $authors = explode(',', $author);

        $page = $request->input('page', 1);
        $title = $request->input('source');
        $publishedDate = $request->input('published_date');
        $perPage = $request->input('per_page', 50);
        $search = $request->input('search');
        
        $query = News::query();

        if($search)
        {
            $news = $query->where('title', 'like', '%' . $search . '%')
            ->orWhere('author', 'like', '%' . $search . '%')
            ->orWhere('topic', 'like', '%' . $search . '%')
            ->get();
        }
    
        $query = $query->orderBy('published_at', 'desc');
           
        if ($topic) {
            $query->whereIn('topic', (array)$topics);
        }
        if ($source) {
            $query->whereIn('source', (array)$sources);
        }
        if ($author) {
            $query->whereIn('author', (array)$authors);
        }  
    
        if ($publishedDate) {
            $query->whereDate('published_at', $publishedDate);
        }
    
        $news = $query->paginate($perPage, ['*'], 'page', $page);
    
        return response()->json($news);
    }
    
    public function getMetaData()
    {
        $metadata = new Collection([
            'authors' => News::distinct('author')->whereNotNull('author')->pluck('author'),
            'topics' => News::distinct('topic')->whereNotNull('topic')->pluck('topic'),
            'sources' => News::distinct('source')->whereNotNull('source')->pluck('source'),
        ]);
    
        return response()->json($metadata);
    }
    
    
    
    public function deleteAllNews()
    {
        News::truncate();

        return response()->json(['message' => 'All news deleted successfully']);
    }
}