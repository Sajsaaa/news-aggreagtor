<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'title',
        'description',
        'url',
        'published_at',
        'source',
        'topic',
        'image_src',
        'author',
    ];
}
