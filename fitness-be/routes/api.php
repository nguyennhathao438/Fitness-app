<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\TrainingPackageController;
use App\Http\Controllers\BodyMetricController;
use App\Http\Controllers\RoleController;
Route::post('/login', [AuthenController::class, 'login']);
Route::post('/register', [MemberController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::post('/logout', [AuthenController::class, 'logout']);
    Route::post('/body-metrics', [BodyMetricController::class, 'store']);
});
Route::get('/training-packages', [TrainingPackageController::class, 'index']);
Route::get('/package-compare', [TrainingPackageController::class, 'getPackageCompare']);
Route::get('/training-packages/{id}', [TrainingPackageController::class, 'show']);

//Otp 
Route::post('/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);
Route::post('/reset-password', [OtpController::class, 'resetPassword']);
//Role 
Route::prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::post('/', [RoleController::class, 'store']);
    Route::get('{role}', [RoleController::class, 'show']);
    Route::put('{role}', [RoleController::class, 'update']);
});