# Backend Fejlesztői Dokumentáció – Barbershop API

## 1. Áttekintés

A backend egy **Laravel 11** alapú RESTful API, amely egy borbélyüzlet foglalási rendszerét szolgálja ki. Az API JSON formátumban kommunikál, és a **Laravel Sanctum** tokenalapú hitelesítést használ.

| Tulajdonság | Érték |
|---|---|
| Framework | Laravel 11 |
| Nyelv | PHP 8.2+ |
| Adatbázis | MySQL |
| Hitelesítés | Laravel Sanctum (Bearer token) |
| E-mail | Mailtrap SMTP (sandbox) |
| Szerver (dev) | `php artisan serve` → `http://127.0.0.1:8000` |

---

## 2. Projekt struktúra

```
Barbershop/
├── app/
│   ├── Console/Commands/          # Artisan parancsok
│   ├── Http/
│   │   ├── Controllers/Api/       # API kontrollerek
│   │   ├── Middleware/             # Egyedi middleware-ek
│   │   └── Requests/              # Form Request validátorok
│   ├── Jobs/                      # Queue job-ok
│   ├── Mail/                      # Mailable osztályok
│   ├── Models/                    # Eloquent modellek
│   ├── Providers/                 # Service providerek
│   └── Services/                  # Üzleti logika szolgáltatások
├── config/                        # Konfigurációs fájlok
├── database/
│   ├── factories/                 # Model factory-k
│   ├── migrations/                # Adatbázis migrációk
│   └── seeders/                   # Seeder-ek
├── resources/views/emails/        # E-mail Blade template-ek
├── routes/
│   ├── api.php                    # API útvonalak
│   ├── web.php                    # Web útvonalak
│   └── console.php                # Konzol útvonalak
├── storage/                       # Log-ok, cache, stb.
└── tests/                         # PHPUnit tesztek
```

---

## 3. Adatbázis séma

### 3.1 `users`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| name | string | Felhasználó neve |
| email | string (unique) | E-mail cím |
| email_verified_at | datetime (null) | E-mail megerősítés dátuma |
| password | string (hashed) | Jelszó (bcrypt) |
| role | string | Szerepkör: `user`, `admin`, `barber` |
| created_at / updated_at | timestamps | Létrehozás / módosítás |

### 3.2 `barbers`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| user_id | bigint (FK, null) | Kapcsolt felhasználó |
| name | string | Borbély neve |
| specialization | string (null) | Szakterület |
| bio | text (null) | Bemutatkozó szöveg |
| photo_url | string (null) | Profilkép URL |
| created_at / updated_at | timestamps | |

### 3.3 `hairstyles`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| name | string | Frizura neve |
| description | text (null) | Leírás |
| price | integer | Ár (Ft) |
| duration_min | integer | Időtartam percben |
| created_at / updated_at | timestamps | |

### 3.4 `bookings`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| barber_id | bigint (FK) | Borbély azonosító |
| user_id | bigint (null) | Bejelentkezett felhasználó |
| customer_name | string | Ügyfél neve |
| customer_email | string | Ügyfél e-mail |
| customer_phone | string | Ügyfél telefonszám |
| start_at | datetime | Foglalás kezdete |
| duration_min | integer (def: 30) | Időtartam percben |
| note | text (null) | Megjegyzés |
| status | enum | `confirmed` / `cancelled` |
| created_at / updated_at | timestamps | |



### 3.5 `gallery_images`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| title | string (null) | Kép címe |
| image_url | string | Kép URL |
| source | string (null) | Forrás / szerző |
| created_at / updated_at | timestamps | |

### 3.6 `barber_breaks`

| Mező | Típus | Leírás |
|---|---|---|
| id | bigint (PK) | Automatikus azonosító |
| barber_id | bigint (FK) | Borbély azonosító |
| title | string | Szünet megnevezése |
| start_at | datetime | Kezdés |
| end_at | datetime | Befejezés |
| recurring | boolean (def: false) | Napi ismétlődő-e |
| created_at / updated_at | timestamps | |

---

## 4. Eloquent modellek

### `User`
- Implementálja: `MustVerifyEmail`
- Trait-ek: `HasApiTokens`, `HasFactory`, `Notifiable`
- Relációk: `hasMany(Booking::class)`

### `Barber`
- Accessor: `photo_url` – relatív útvonalat abszolút URL-re alakít
- Relációk: `belongsTo(User)`, `hasMany(Booking)`, `hasMany(BarberBreak)`

### `Booking`
- Cast: `start_at → datetime`
- Relációk: `belongsTo(Barber)`, `belongsTo(User)`

### `Hairstyle`
- Egyszerű CRUD modell, nincs reláció

### `GalleryImage`
- Tábla neve explicit: `gallery_images`

### `BarberBreak`
- Relációk: `belongsTo(Barber)`

---

## 5. Middleware

### `RoleMiddleware`
- Alias: `role`
- Használat: `middleware('role:admin')` vagy `middleware('role:admin,barber')`
- Működés: Ellenőrzi, hogy a bejelentkezett felhasználó `role` mezője megegyezik-e valamelyik megadott szerepkörrel
- Hiba: `403 Hozzáférés megtagadva.`

---

## 6. API végpontok

**Base URL:** `http://127.0.0.1:8000/api`

### 6.1  Ellenőrzés

| Metódus | Útvonal | Leírás |
|---|---|---|
| GET | `/ping` | Szerver elérhetőség ellenőrzése |

### 6.2 Hitelesítés (`/auth`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| POST | `/auth/register` | – | Regisztráció |
| POST | `/auth/login` | – | Bejelentkezés |
| POST | `/auth/logout` |  Sanctum | Kijelentkezés |
| GET | `/auth/me` |  Sanctum | Bejelentkezett felhasználó lekérése |
| POST | `/auth/email/resend` |  Sanctum | E-mail verifikáció újraküldése |
| POST | `/auth/forgot-password` | – | Jelszó-visszaállítási link küldése |
| POST | `/auth/reset-password` | – | Jelszó visszaállítása |
| GET | `/email/verify/{id}/{hash}` | – | E-mail cím megerősítése |

#### POST `/auth/register`
**Request body:**
```json
{
  "name": "Teszt Felhasználó",
  "email": "teszt@example.com",
  "password": "jelszo123",
  "password_confirmation": "jelszo123"
}
```
**Válasz (201):**
```json
{
  "user": { "id": 1, "name": "...", "email": "...", "role": "user" },
  "message": "Regisztrálva. Kérjük, erősítse meg e-mail címét."
}
```

#### POST `/auth/login`
**Request body:**
```json
{
  "email": "teszt@example.com",
  "password": "jelszo123"
}
```
**Válasz (200):**
```json
{
  "message": "Bejelentkezve",
  "user": { "id": 1, "name": "...", "email": "...", "role": "user" },
  "token": "1|abc123..."
}
```

#### POST `/auth/forgot-password`
**Request body:**
```json
{ "email": "teszt@example.com" }
```

#### POST `/auth/reset-password`
**Request body:**
```json
{
  "token": "reset-token-string",
  "email": "teszt@example.com",
  "password": "ujjelszo123",
  "password_confirmation": "ujjelszo123"
}
```

### 6.3 Borbélyok (`/barbers`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/barbers` | – | Összes borbély listázása |
| GET | `/barbers/{id}` | – | Egy borbély lekérése |
| GET | `/barbers/{id}/next-slot` | – | Következő szabad időpont |
| GET | `/barbers/{id}/schedule` | – | Foglalási naptár |
| POST | `/barbers` |  Admin | Új borbély létrehozása |
| PUT | `/barbers/{id}` |  Admin | Borbély módosítása |
| DELETE | `/barbers/{id}` |  Admin | Borbély törlése |

#### GET `/barbers/{id}/schedule`
**Query paraméterek:**
- `dateFrom` (Y-m-d) – kötelező
- `dateTo` (Y-m-d) – kötelező

#### POST `/barbers`
**Request body:**
```json
{
  "name": "Kiss Péter",
  "specialization": "Klasszikus hajvágás",
  "bio": "10 éves tapasztalat",
  "photo_url": "https://example.com/photo.jpg",
  "user_id": 2
}
```

### 6.4 Foglalások (`/bookings`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/availability` | – | Szabad időpontok lekérdezése |
| GET | `/day-schedule` | – | Napi beosztás (slot-ok státusszal) |
| GET | `/sos-slots` | – | SOS foglalás – legközelebbi szabad idők |
| POST | `/bookings` | – | Új foglalás létrehozása |
| GET | `/bookings` |  Sanctum | Foglalások listázása (saját/admin) |
| GET | `/bookings/{id}` |  Sanctum | Egy foglalás lekérése |
| PUT | `/bookings/{id}` |  Admin | Foglalás módosítása |
| DELETE | `/bookings/{id}` |  Sanctum | Foglalás lemondása |

#### GET `/availability`
**Query paraméterek:**
- `barberId` (int) – kötelező
- `dateFrom` (Y-m-d) – kötelező
- `dateTo` (Y-m-d) – kötelező
- `duration` (int, perc) – opcionális (default: 30)

#### GET `/day-schedule`
**Query paraméterek:**
- `barberId` (int) – kötelező
- `date` (Y-m-d) – kötelező
- `duration` (int) – opcionális (default: 30)

**Válasz:**
```json
{
  "barber_id": 1,
  "date": "2026-04-02",
  "duration": 30,
  "slots": [
    { "time": "09:00", "datetime": "2026-04-02T09:00:00+02:00", "status": "available" },
    { "time": "09:30", "datetime": "2026-04-02T09:30:00+02:00", "status": "booked" },
    { "time": "12:00", "datetime": "2026-04-02T12:00:00+02:00", "status": "break" }
  ]
}
```

#### GET `/sos-slots`
**Query paraméterek:**
- `duration` (int, 15–180) – opcionális (default: 30)
- `count` (int, 1–10) – opcionális (default: 4)

#### POST `/bookings`
**Request body:**
```json
{
  "barber_id": 1,
  "customer_name": "Nagy Anna",
  "customer_email": "anna@example.com",
  "customer_phone": "+36201234567",
  "start_at": "2026-04-02T10:00:00",
  "duration_min": 30,
  "note": "Rövid hajat kérek"
}
```
**Válasz (201):**
```json
{
  "message": "Foglalás sikeresen létrehozva.",
  "booking": { "id": 1, "barber_id": 1, "status": "confirmed", "barber": { ... } }
}
```
**Hiba (409):** `"Ez az időpont már foglalt."`

### 6.5 Borbély saját dashboard (`/barber`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/barber/me` |  Barber/Admin | Saját borbély profil |
| GET | `/barber/bookings` |  Barber/Admin | Saját foglalások |
| PUT | `/barber/bookings/{id}` |  Barber/Admin | Foglalás módosítása (sajátjait) |
| DELETE | `/barber/bookings/{id}` |  Barber/Admin | Foglalás lemondása (sajátjait) |
| GET | `/barber/breaks` |  Barber/Admin | Saját szünetek |

### 6.6 Borbély szünetek (`/barber-breaks`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/barbers/{barberId}/breaks` | – | Szünetek listázása (publikus) |
| POST | `/barber-breaks` |  Admin/Barber | Szünet létrehozása |
| PUT | `/barber-breaks/{id}` |  Admin/Barber | Szünet módosítása |
| DELETE | `/barber-breaks/{id}` |  Admin/Barber | Szünet törlése |

#### POST `/barber-breaks`
**Request body:**
```json
{
  "barber_id": 1,
  "title": "Ebédszünet",
  "start_at": "2026-04-02T12:00:00",
  "end_at": "2026-04-02T13:00:00",
  "recurring": true
}
```

### 6.7 Frizurák (`/hairstyles`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/hairstyles` | – | Összes frizura |
| GET | `/hairstyles/{id}` | – | Egy frizura |
| POST | `/hairstyles` |  Admin | Létrehozás |
| PUT | `/hairstyles/{id}` |  Admin | Módosítás |
| DELETE | `/hairstyles/{id}` |  Admin | Törlés |

#### POST `/hairstyles`
**Request body:**
```json
{
  "name": "Hajvágás",
  "description": "Klasszikus férfi hajvágás",
  "price": 4500,
  "duration_min": 30
}
```

### 6.8 Galéria (`/gallery`)

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/gallery` | – | Összes galéria kép |
| POST | `/gallery` |  Admin | Kép hozzáadása |
| DELETE | `/gallery/{id}` |  Admin | Kép törlése |

#### POST `/gallery`
**Request body:**
```json
{
  "title": "Klasszikus frizura",
  "image_url": "https://example.com/image.jpg",
  "source": "Csukodi Zoltan"
}
```

### 6.9 Felhasználók (`/users`) – Admin

| Metódus | Útvonal | Auth | Leírás |
|---|---|---|---|
| GET | `/users` |  Admin | Összes felhasználó |
| GET | `/users/{id}` |  Admin | Egy felhasználó |
| PUT | `/users/{id}` |  Admin | Felhasználó módosítása |
| DELETE | `/users/{id}` |  Admin | Felhasználó törlése |

#### PUT `/users/{id}`
**Request body (mind opcionális):**
```json
{
  "name": "Új Név",
  "email": "uj@email.com",
  "role": "admin",
  "password": "ujjelszo123"
}
```

---

## 7. Szolgáltatások (Services)

### `BookingService`

Az üzleti logika nagy része itt található:

| Metódus | Leírás |
|---|---|
| `isSlotAvailable($barberId, $startTime, $durationMin)` | Ellenőrzi, hogy a slot szabad-e (foglalás + szünet) |
| `isInBreak($barberId, $startTime, $endTime)` | Szünet-ütközés vizsgálat (egyszeri + ismétlődő) |
| `getDaySchedule($barberId, $date, $slotDuration)` | Napi beosztás részletes slot-listával |
| `getAvailableSlots($barberId, $date, $slotDuration)` | Szabad slot-ok listája (datetime-ek) |
| `getNextAvailableSlot($barberId, $slotDuration)` | Következő szabad időpont keresése |
| `getSosSlots($slotDuration, $count, $maxDays)` | SOS foglalás: legközelebbi N slot az összes borbélynál |

**Munkaidő:** 9:00–18:00, slot-lépésköz: 15 perc.

---

## 8. E-mail rendszer

### Mailable-ek

| Osztály | Tárgy | Template |
|---|---|---|
| `BookingConfirmedMail` |  Foglalás visszaigazolása – Barber Shop | `emails.booking-confirmed` |
| `BookingReminderMail` |  Emlékeztető: Holnap időpontod van – Barber Shop | `emails.booking-reminder` |

### Dátum lokalizáció
A Blade template-ek `->locale('hu')->translatedFormat('Y. F j. (l) H:i')` formátumot használnak a magyar dátumokhoz (pl. „2026. április 2. (csütörtök) 10:00").

### Job
`SendBookingReminderJob` – Aszinkron e-mail küldés queue-n keresztül.

---

## 9. Tesztelés

```bash
# PHPUnit tesztek
php artisan test

# Egy adott tesztfájl futtatása
php artisan test --filter=BookingTest
```

---

## 10. Fontos konfigurációk

### CORS (`config/cors.php`)
- Az Angular frontend (`localhost:4200`) hozzáférhet az API-hoz
- `supports_credentials: true` szükséges a Sanctum-hoz

### Sanctum (`config/sanctum.php`)
- Stateful domains: `localhost:4200`, `127.0.0.1:8000`

### Mail (`.env`)
```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=<mailtrap_username>
MAIL_PASSWORD=<mailtrap_password>
```
