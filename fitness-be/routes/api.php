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
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\MuscleGroupController;
use App\Http\Controllers\AdminPackageController;    
use App\Http\Controllers\PackageTypeController;
use App\Http\Controllers\ServiceController;

Route::post('/login', [AuthenController::class, 'login']);
Route::post('/register', [MemberController::class, 'register']);
Route::post('/check-email', [AuthenController::class, 'checkEmail']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::post('/logout', [AuthenController::class, 'logout']);
    //  NÂNG CẤP  GIA HẠN GÓI TẬP 
    Route::get('/packages/upgrade', [TrainingPackageController::class, 'getUpgradablePackages']);
    Route::get('/packages/upgrade-types', [TrainingPackageController::class, 'getUpgradableTypes']);
    Route::get('/packages/upgrade-list', [TrainingPackageController::class, 'getUpgradablePackagesByType']);

    Route::get('/member/current-package', [TrainingPackageController::class, 'getCurrentPackageInfo']);
    
    Route::post('/member/upgrade', [MemberController::class, 'upgrade']);

    //body metric
    Route::post('/body-metrics', [BodyMetricController::class, 'store']);
    Route::get('/body-metrics', [BodyMetricController::class, 'index']);
    Route::get('/body-metrics/latest', [BodyMetricController::class, 'latest']); // Đặt trước
    Route::get('/body-metrics/latest/{memberId}', [BodyMetricController::class, 'getLastUpdated']);
    Route::get('/body-metrics/{memberID}', [BodyMetricController::class, 'getAll']);
    //member
    Route::put('/deleted/{memberID}', [MemberController::class, 'deletedUser']);
    Route::put('/update/{memberID}', [MemberController::class, 'editUser']);
    Route::put('/change-password', [MemberController::class, 'changePassword']);
    Route::put('/profile', [MemberController::class, 'updateProfile']);
    Route::get('member-thismonth', [MemberController::class, 'getUserThisMonth']);
    Route::get('/userchart', [MemberController::class, 'getMemberChart']);
    //PT
    Route::get('/personal-trainers', [PersonalTrainerController::class, 'getPT']);
    Route::get('/genderStat', [MemberController::class, 'memberStats']);
    Route::get('/BirthStat', [MemberController::class, 'AgeStats']);
    Route::post('/personal-trainers', [PersonalTrainerController::class, 'createPT']);
    //exercise
    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
    Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']);
    Route::get('/exercises/by-muscle-group/{muscleGroupId}', [ExerciseController::class, 'getByMuscleGroup']);

    // Muscle Group
    Route::get('/muscle-groups', [MuscleGroupController::class, 'index']);
    Route::post('/muscle-groups', [MuscleGroupController::class, 'store']);
    Route::get('/muscle-groups/{id}', [MuscleGroupController::class, 'show']);
    Route::put('/muscle-groups/{id}', [MuscleGroupController::class, 'update']);
    Route::delete('/muscle-groups/{id}', [MuscleGroupController::class, 'destroy']);
    //invoice
    Route::get('/invoice', [InvoiceController::class, 'getInvoice']);
    Route::get('/invoice-thismonth', [InvoiceController::class, 'getInvoiceThisMonth']);
    Route::get('/paymentstat', [InvoiceController::class, 'getPayment']);
    Route::get('/invoice-permonth', [InvoiceController::class, 'getInvoicePerMonth']);
    Route::get('/invoice-moneystat', [InvoiceController::class, 'getInvoiceMoney']);
    Route::put('/invoice_delete/{invoiceID}', [InvoiceController::class, 'deleteInvoice']);
    
    //package
    Route::get('/packages', [AdminPackageController::class, 'index']);
    Route::get('/packages/stats', [AdminPackageController::class, 'stats']); 
    Route::get('/packages/{id}', [AdminPackageController::class, 'show']);
    Route::post('/packages', [AdminPackageController::class, 'store']);
    Route::put('/packages/{id}', [AdminPackageController::class, 'update']);
    Route::delete('/packages/{id}', [AdminPackageController::class, 'destroy']);
    
    Route::get('/package-type', [AdminPackageController::class, 'getTypes']);

    // Lấy danh sách Dịch vụ Cho checkbox
    Route::get('/services', [PackageTypeController::class, 'getAllService']);

    // Package Types
    Route::get('/package-types', [PackageTypeController::class, 'index']);      
    Route::post('/package-types', [PackageTypeController::class, 'store']);       
    Route::get('/package-types/{id}', [PackageTypeController::class, 'show']);    
    Route::put('/package-types/{id}', [PackageTypeController::class, 'update']);  
    Route::delete('/package-types/{id}', [PackageTypeController::class, 'destroy']);

    Route::get('/services-manage', [ServiceController::class, 'index']);        
    Route::post('/services-manage', [ServiceController::class, 'store']);      
    Route::get('/services-manage/{id}', [ServiceController::class, 'show']);    
    Route::put('/services-manage/{id}', [ServiceController::class, 'update']);  
    Route::delete('/services-manage/{id}', [ServiceController::class, 'destroy']); 
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
