<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Member;
use App\Models\PTClient;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PTMembersTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_get_pt_members_return_list_successfully()
    {
        // ===== Arrange =====
        $pt = User::factory()->create([
            'role' => 'pt',
        ]);

        $member = Member::factory()->create([
            'name' => 'Nguyen Van A',
        ]);

        // Member thuộc PT
        PTClient::create([
            'pt_id' => $pt->id,
            'member_id' => $member->id,
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addMonth(),
        ]);

        // Member KHÔNG thuộc PT (để test filter)
        $otherPt = User::factory()->create(['role' => 'pt']);
        $otherMember = Member::factory()->create();

        PTClient::create([
            'pt_id' => $otherPt->id,
            'member_id' => $otherMember->id,
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addMonth(),
        ]);

        // ===== Act =====
        $response = $this->actingAs($pt, 'sanctum')
            ->getJson('/api/pt/members');

        // ===== Assert =====
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    [
                        'member_id',
                        'name',
                        'phone',
                        'avatar',
                        'status',
                        'start_date',
                        'end_date',
                        'target_type',
                        'last_training',
                    ]
                ]
            ]);

        // Trả về đúng 1 member của PT
        $this->assertCount(1, $response->json('data'));

        // Dữ liệu đúng
        $this->assertEquals(
            $member->id,
            $response->json('data.0.member_id')
        );

        $this->assertEquals(
            'Nguyen Van A',
            $response->json('data.0.name')
        );
    }
}
