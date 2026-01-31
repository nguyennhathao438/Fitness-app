<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenController;
use App\Http\Controllers\BodyMetricController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PersonalTrainerController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\TrainingPackageController;
Route::post('/login', [AuthenController::class, 'login']);
Route::post('/register', [MemberController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::post('/logout', [AuthenController::class, 'logout']);
});
Route::get('/training-packages', [TrainingPackageController::class, 'index']);
Route::get('/package-compare', [TrainingPackageController::class, 'getPackageCompare']);
Route::get('/training-packages/{id}', [TrainingPackageController::class, 'show']);
Route::get('/personal-trainers', [PersonalTrainerController::class, 'getPT']);
Route::get('/genderStat',[MemberController::class,'memberStats']);
Route::get('/BirthStat',[MemberController::class,'AgeStats']);
Route::get('/body-metrics/latest/{memberId}',[BodyMetricController::class, 'getLastUpdated']);
Route::get('/body-metrics/{memberID}', [BodyMetricController::class, 'getAll']);
Route::put('/deleted/{memberID}',[MemberController::class,'deletedUser']);
Route::put('/update/{memberID}',[MemberController::class,'editUser']);
Route::post('/personal-trainers', [PersonalTrainerController::class, 'createPT']);
