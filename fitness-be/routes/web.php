<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $detail = (object)[
        'body' => 'Nội dung demo'
    ];

    return view('welcome', compact('detail'));
});
