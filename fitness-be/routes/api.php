<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenController;
use App\Http\Controllers\BodyMetricController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PersonalTrainerController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\TrainingPackageController;
use App\Http\Controllers\RoleController;
Route::post('/login', [AuthenController::class, 'login']);
Route::post('/register', [MemberController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::post('/logout', [AuthenController::class, 'logout']);
    //body metric
    Route::post('/body-metrics', [BodyMetricController::class, 'store']);
    Route::get('/body-metrics/latest/{memberId}', [BodyMetricController::class, 'getLastUpdated']);
    Route::get('/body-metrics/{memberID}', [BodyMetricController::class, 'getAll']);
    //member
    Route::put('/deleted/{memberID}', [MemberController::class, 'deletedUser']);
    Route::put('/update/{memberID}', [MemberController::class, 'editUser']);
    Route::get('member-thismonth',[MemberController::class,'getUserThisMonth']);
    Route::get('/userchart', [MemberController::class, 'getMemberChart']);
    //PT
    Route::get('/personal-trainers', [PersonalTrainerController::class, 'getPT']);
    Route::get('/genderStat', [MemberController::class, 'memberStats']);
    Route::get('/BirthStat', [MemberController::class, 'AgeStats']);
    Route::post('/personal-trainers', [PersonalTrainerController::class, 'createPT']);
    //invoice
    Route::get('/invoice',[InvoiceController::class,'getInvoice']);
    Route::get('/invoice-thismonth',[InvoiceController::class,'getInvoiceThisMonth']);
    Route::get('/paymentstat', [InvoiceController::class, 'getPayment']);
    Route::get('/invoice-permonth', [InvoiceController::class, 'getInvoicePerMonth']);
    Route::get('/invoice-moneystat', [InvoiceController::class, 'getInvoiceMoney']);
    Route::put('/invoice_delete/{invoiceID}',[InvoiceController::class,'deleteInvoice']);
});
//package
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
    Route::delete('{role}', [RoleController::class, 'destroy']);
});
//Permission
Route::get('/permissions', [RoleController::class, 'getAllPermission']);
