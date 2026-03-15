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
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MuscleGroupController;
use App\Http\Controllers\AdminPackageController;
use App\Http\Controllers\PackageTypeController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\WorkoutHistoryController;
use App\Http\Controllers\WorkoutHistoryDetailController;
use App\Http\Controllers\PTClientController;
use App\Http\Controllers\SurveyTrainingController;

use App\Http\Controllers\ChatbotController;

use App\Http\Controllers\PTScheduleController;
use App\Http\Controllers\PTController;
use App\Http\Controllers\NotificationController;
Route::post('/login', [AuthenController::class, 'login']);
Route::post('/register', [MemberController::class, 'register']);
Route::post('/check-email', [AuthenController::class, 'checkEmail']);
Route::middleware('auth:sanctum')->group(function () {
    //Chatbot 
    Route::post('/chatbot', [ChatbotController::class, 'getIntent']);
    //Lấy thông tin bản thân
    Route::get('/myInfo', [AuthenController::class, 'getMyInfo']);
    //survey
    Route::get('/survey-member', [SurveyTrainingController::class, 'getSurveyMember']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::post('/logout', [AuthenController::class, 'logout']);
    //  NÂNG CẤP  GIA HẠN GÓI TẬP 
    Route::get('/packages/upgrade', [TrainingPackageController::class, 'getUpgradablePackages']);
    Route::get('/packages/upgrade-types', [TrainingPackageController::class, 'getUpgradableTypes']);
    Route::get('/packages/upgrade-list', [TrainingPackageController::class, 'getUpgradablePackagesByType']);

    Route::get('/member/current-package', [TrainingPackageController::class, 'getCurrentPackageInfo']);

    Route::post('/member/upgrade', [MemberController::class, 'upgrade']);
    Route::get('/member/my-schedules', [PTScheduleController::class, 'mySchedules']);

    //body metric
    Route::post('/body-metrics', [BodyMetricController::class, 'store']);
    Route::get('/body-metrics', [BodyMetricController::class, 'index']);
    Route::get('/body-metrics/latest', [BodyMetricController::class, 'latest']); // Đặt trước
    Route::get('/body-metrics/latest/{memberId}', [BodyMetricController::class, 'getLastUpdated']);
    Route::get('/body-metrics/{memberID}', [BodyMetricController::class, 'getAll']);
    //member
    Route::put('/deleted/{memberID}', [MemberController::class, 'deletedUser']);
    Route::put('/deleted_pt/{ptID}', [MemberController::class, 'deletePT']);
    Route::put('/update/{memberID}', [MemberController::class, 'editUser']);
    Route::put('/change-password', [MemberController::class, 'changePassword']);
    Route::put('/profile', [MemberController::class, 'updateProfile']);
    Route::get('/member-thismonth', [MemberController::class, 'getUserThisMonth']);
    Route::get('/userchart', [MemberController::class, 'getMemberChart']);
    Route::get('/members', [MemberController::class, 'getMember']);
    Route::get('/userStat', [MemberController::class, 'getStatUser']);
    Route::get('/havePT', [MemberController::class, 'memberHavePTStats']);
    Route::get('/me', [MemberController::class, 'getMe']);
    //PT
    Route::get('/personal-trainers', [PersonalTrainerController::class, 'getPT']);
    Route::get('/genderStat', [MemberController::class, 'memberStats']);
    Route::get('/BirthStat', [MemberController::class, 'AgeStats']);
    Route::post('/personal-trainers', [PersonalTrainerController::class, 'createPT']);


    //invoice
    Route::get('/invoice', [InvoiceController::class, 'getInvoice']);
    Route::get('/invoice-thismonth', [InvoiceController::class, 'getInvoiceThisMonth']);
    Route::get('/paymentstat', [InvoiceController::class, 'getPayment']);
    Route::get('/invoice-permonth', [InvoiceController::class, 'getInvoicePerMonth']);
    Route::get('/invoice-moneystat', [InvoiceController::class, 'getInvoiceMoney']);
    Route::get('/invoice-memberlongtime', [InvoiceController::class, 'getMemberByInvoice']);
    Route::put('/invoice_delete/{invoiceID}', [InvoiceController::class, 'deleteInvoice']);
    //package
    Route::get('/packages', [AdminPackageController::class, 'index']);
    Route::get('/packages/stats', [AdminPackageController::class, 'stats']);
    Route::get('/packages/{id}', [AdminPackageController::class, 'show']);
    Route::post('/packages', [AdminPackageController::class, 'store']);
    Route::put('/packages/{id}', [AdminPackageController::class, 'update']);
    Route::delete('/packages/{id}', [AdminPackageController::class, 'destroy']);
    Route::get('/registration-stats', [AdminPackageController::class, 'getPackageStat']);

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
    // Workout History
    Route::post('/workout-history', [WorkoutHistoryController::class, 'store']);
    Route::get('/workout-history', [WorkoutHistoryController::class, 'index']);
    Route::get('/workout-history/latest', [WorkoutHistoryController::class, 'latest']);
    Route::get('/workout-history/today', [WorkoutHistoryController::class, 'today']);
    Route::put('/workout-history/{id}/completion', [WorkoutHistoryController::class, 'updateCompletion']);
    Route::put('/workout-history/{id}', [WorkoutHistoryController::class, 'update']);
    Route::get('/workout-history/{id}', [WorkoutHistoryController::class, 'show']);

    // Workout History Detail
    Route::get('/workout-history-details', [WorkoutHistoryDetailController::class, 'getAll']);
    Route::get('/workout-history-details', [WorkoutHistoryDetailController::class, 'index']);
    Route::post('/workout-history-details', [WorkoutHistoryDetailController::class, 'store']);
    Route::get('/workout-history-details/{id}', [WorkoutHistoryDetailController::class, 'show']);
    Route::put('/workout-history-details/{id}', [WorkoutHistoryDetailController::class, 'update']);
    Route::get('/workout-history-details/history/{workoutHistoryId}', [WorkoutHistoryDetailController::class, 'indexExist']);
    Route::put('/invoice_update/{invoiceID}', [InvoiceController::class, 'updateInvoice']);
    //PTClient
    Route::post('/ptclient', [PTClientController::class, 'createPTClient']);
    Route::get('/all_pt', [PTClientController::class, 'getPT']);
    Route::get('/allMember/{ptID}', [PTClientController::class, 'getAllforPT']);
    Route::get('/session', [PTClientController::class, 'getTopPT']);
    Route::put('/cancel_pt', [PTClientController::class, 'cancelPT']);
    Route::put('/change_pt', [PTClientController::class, 'ChangePT']);
    // Message
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/{userId}', [MessageController::class, 'getMessages']);
    Route::get('/chatWithPt', [MessageController::class, 'getChatPartners']);
    Route::get('/chatFromPt', [MessageController::class, 'getPTClients']);
    Route::get('/getChatPt', [MessageController::class, 'getChatWithPT']);
    // member xem lich
    Route::get('/member/my-pt', [MemberController::class, 'myPT']);//ok

    // Member chọn PT lần đầu
    Route::post('/member/choose-pt', [MemberController::class, 'choosePT']);

    // Lấy danh sách PT
    Route::get('/member/pts', [MemberController::class, 'listPTs']);
    Route::post('/member/register/{scheduleId}', [PTScheduleController::class, 'register']);
    Route::get('/member/schedules', [PTScheduleController::class, 'memberSchedules']);//lấy lịch của PT
    Route::get('/member/my-schedules', [PTScheduleController::class, 'myRegisteredSchedules']);// lấy lịch của mình

    Route::delete('/member/{id}/cancel', [MemberController::class, 'cancel'])
        ->middleware('auth:sanctum');
});
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/pt/schedule', [PTScheduleController::class, 'createSchedule']);
    Route::get('/pt/schedules', [PTScheduleController::class, 'ptSchedules']);
    Route::post('/pt/schedule/{id}/register', [PTScheduleController::class, 'register']);
    Route::post('/pt/assign-member', [PTController::class, 'assignMember']);
    Route::put('/pt/schedule/{id}', [PTScheduleController::class, 'updateSchedule']);
    Route::delete('/pt/schedule/{id}', [PTScheduleController::class, 'deleteSchedule']);
    Route::get('/pt/members/{id}', [MemberController::class, 'getMemberDetailForPT']);

});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pt/members', [PTController::class, 'myMembers']);
});

// Muscle Group
Route::get('/muscle-groups', [MuscleGroupController::class, 'index']);
Route::post('/muscle-groups', [MuscleGroupController::class, 'store']);
Route::get('/muscle-groups/{id}', [MuscleGroupController::class, 'show']);
Route::put('/muscle-groups/{id}', [MuscleGroupController::class, 'update']);
Route::delete('/muscle-groups/{id}', [MuscleGroupController::class, 'destroy']);
//exercise
Route::get('/exercises', [ExerciseController::class, 'index']);
Route::post('/exercises', [ExerciseController::class, 'store']);
Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']);
Route::get('/exercises/by-muscle-group/{muscleGroupId}', [ExerciseController::class, 'getByMuscleGroup']);
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

Route::get('/permissions', [RoleController::class, 'getAllPermission']);
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});