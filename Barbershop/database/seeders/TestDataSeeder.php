<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Barber;
use App\Models\Hairstyle;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@barbershop.local'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        $this->command->info("Admin: {$admin->email} (role: {$admin->role})");

        // Barber user
        $barberUser = User::firstOrCreate(
            ['email' => 'barber@barbershop.local'],
            [
                'name' => 'Borbély Béla',
                'password' => bcrypt('password'),
                'role' => 'barber',
                'email_verified_at' => now(),
            ]
        );
        $this->command->info("Barber user: {$barberUser->email} (role: {$barberUser->role})");

        // Create barber profile linked to barber user
        $barber = Barber::firstOrCreate(
            ['user_id' => $barberUser->id],
            [
                'name' => 'Borbély Béla',
                'specialization' => 'Klasszikus hajvágás',
                'bio' => 'Tapasztalt borbély, 10 éves szakmai múlttal.',
                'photo_url' => null,
            ]
        );
        $this->command->info("Barber profile: {$barber->name} (id: {$barber->id})");

        // A second barber
        $barber2 = Barber::firstOrCreate(
            ['name' => 'Kovács Péter'],
            [
                'user_id' => null,
                'specialization' => 'Modern frizurák',
                'bio' => 'Fiatalos stílusok szakértője.',
                'photo_url' => null,
            ]
        );
        $this->command->info("Barber profile: {$barber2->name} (id: {$barber2->id})");

        // Hairstyles
        $styles = [
            ['name' => 'Klasszikus hajvágás', 'description' => 'Hagyományos ollós hajvágás', 'price_from' => 3500],
            ['name' => 'Fade hajvágás', 'description' => 'Modern átmenetes vágás', 'price_from' => 4000],
            ['name' => 'Szakállformázás', 'description' => 'Szakáll igazítás és formázás', 'price_from' => 2500],
            ['name' => 'Teljes csomag', 'description' => 'Hajvágás + szakállformázás', 'price_from' => 5500],
        ];

        foreach ($styles as $s) {
            Hairstyle::firstOrCreate(['name' => $s['name']], $s);
        }
        $this->command->info("Hairstyles seeded.");

        $this->command->info("");
        $this->command->info("--- KÉSZ ---");
        $this->command->info("Admin login: admin@barbershop.local / password");
        $this->command->info("Barber login: barber@barbershop.local / password");
    }
}
