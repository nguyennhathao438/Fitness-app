<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{id}', function ($member, $id) {
    return (int) $member->id === (int) $id;
}, ['guards' => ['member']]);
Broadcast::channel('admin.notifications', function ($member) {

    return $member->roles()
        ->where('name', 'Admin')
        ->exists();

}, ['guards' => ['member']]);