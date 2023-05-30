<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserPreferenceController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/fetch-news', [NewsController::class, 'fetchAndStoreNews']);
Route::get('/news', [NewsController::class, 'getAllNews']);
Route::delete('/news', [NewsController::class, 'deleteAllNews']);
Route::get('news/metadata', [NewsController::class, 'getMetaData']);

Route::resource('user-preferences', UserPreferenceController::class)->only([
    'store',
]);
Route::get('/user-preferences/{userId}', [UserPreferenceController::class, 'getByUserId']);
