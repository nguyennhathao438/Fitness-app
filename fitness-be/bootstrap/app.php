<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Database\QueryException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //Luôn trả về JSON cho API
        $exceptions->render(function (Throwable $e, $request) {

            // 422 - validate
            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $e->errors()
                ], 422);
            }

            // 401 - auth
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Chưa đăng nhập'
                ], 401);
            }

            // 404 - model
            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'success' => false,
                    'code' => 'NOT_FOUND',
                    'message' => 'Không tìm thấy dữ liệu'
                ], 404);
            }

            // 403 / 404 / 405
            if ($e instanceof HttpException) {
                return response()->json([
                    'success' => false,
                    'code' => 'HTTP_ERROR',
                    'message' => $e->getMessage()
                ], $e->getStatusCode());
            }

            // 500 - DB
            if ($e instanceof QueryException) {
                return response()->json([
                    'success' => false,
                    'code' => 'DB_ERROR',
                    'message' => 'Lỗi cơ sở dữ liệu'
                ], 500);
            }

            // 500 - fallback
            return response()->json([
                'success' => false,
                'code' => 'SERVER_ERROR',
                'message' => 'Lỗi hệ thống'
            ], 500);
        });
    })->create();
