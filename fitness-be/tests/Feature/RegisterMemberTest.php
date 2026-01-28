<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Member;
use App\Models\TrainingPackage;
use App\Models\PackageType;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterMemberTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function register_member_success()
    {
        // Tạo loại gói
        $packageType = PackageType::factory()->create([
            'name' => 'Gym'
        ]);

        // Tạo gói tập
        $package = TrainingPackage::factory()->create([
            'package_type_id' => $packageType->id,
        ]);

        // Call API đăng ký
$response = $this->postJson('/api/register', [
            'name' => 'Nguyen Van A',
            'email' => 'test@gmail.com',
            'password' => '123456',
            'phone' => '0123456789',
            'package_id' => $package->id,
            'payment_method' => 'momo',
        ]);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'member' => [
                    'id',
                    'name',
                    'email',
                ],
                'valid_until',
            ]);
    }
}
