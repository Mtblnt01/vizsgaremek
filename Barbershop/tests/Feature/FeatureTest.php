<?php

namespace Tests\Feature;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\GalleryImage;
use App\Models\Hairstyle;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureTest extends TestCase
{
    use RefreshDatabase;



    private function actingAsAdmin(): User
    {
        $admin = User::factory()->admin()->create();
        return $admin;
    }

    private function actingAsUser(): User
    {
        $user = User::factory()->create();
        return $user;
    }

    private function createBarber(array $attrs = []): Barber
    {
        return Barber::create(array_merge([
            'name' => 'Teszt Borbély',
            'specialization' => 'Fade',
            'bio' => 'Bio szöveg',
            'photo_url' => 'https://example.com/photo.jpg',
        ], $attrs));
    }

    private function futureDateTime(int $daysAhead = 1, int $hour = 10): string
    {
        return Carbon::now()->addDays($daysAhead)->setTime($hour, 0)->format('Y-m-d\TH:i:s');
    }


    public function test_sikeres_regisztracio(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Teszt Elek',
            'email' => 'teszt@pelda.hu',
            'password' => 'Secret123!',
            'password_confirmation' => 'Secret123!',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'message']);

        $this->assertDatabaseHas('users', ['email' => 'teszt@pelda.hu']);
    }


}
