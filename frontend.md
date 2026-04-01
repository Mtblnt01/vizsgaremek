# Frontend Fejlesztői Dokumentáció – Barbershop

## 1. Áttekintés

A frontend egy **Angular 17+** alapú Single Page Application (SPA), amely az ügyfelek és adminisztrátorok számára biztosít felületet a borbélyüzlet foglalási rendszeréhez.

| Tulajdonság | Érték |
|---|---|
| Framework | Angular 17+ (standalone components) |
| Nyelv | TypeScript |
| Stílusok | SCSS |
| HTTP kliens | Angular HttpClient |
| Routing | Angular Router (route guard-okkal) |
| Dev szerver | `ng serve` → `http://localhost:4200` |
| API szerver | `http://localhost:8000/api` |

---

## 2. Projekt struktúra

```
barbershop-frontend/
├── src/
│   ├── app/
│   │   ├── app.routes.ts              # Útvonal definíciók
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # Route guard-ok
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts # Bearer token csatolás
│   │   │   ├── models/                 # TypeScript interfészek
│   │   │   │   ├── barber.model.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── gallery.model.ts
│   │   │   │   ├── hairstyle.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   └── index.ts
│   │   │   └── services/              # API szolgáltatások
│   │   │       ├── api.service.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── barbers.service.ts
│   │   │       ├── barber-bookings.service.ts
│   │   │       ├── barber-breaks.service.ts
│   │   │       ├── bookings.service.ts
│   │   │       ├── gallery.service.ts
│   │   │       ├── hairstyles.service.ts
│   │   │       ├── users.service.ts
│   │   │       └── index.ts
│   │   ├── pages/                      # Oldal komponensek
│   │   │   ├── home/
│   │   │   ├── booking/
│   │   │   ├── booking-success/
│   │   │   ├── gallery/
│   │   │   ├── about/
│   │   │   ├── admin/
│   │   │   ├── barber-dashboard/
│   │   │   ├── copyright/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       ├── forgot-password/
│   │   │       ├── reset-password/
│   │   │       └── verify-email/
│   │   └── shared/                     # Megosztott komponensek
│   │       └── components/
│   │           ├── navbar/
│   │           ├── footer/
│   │           ├── barber-card/
│   │           └── toast/
│   └── environments/
│       ├── environment.ts              # Fejlesztői konfiguráció
│       └── environment.prod.ts         # Produkciós konfiguráció
├── angular.json
├── tsconfig.json
└── package.json
```

---

## 3. Környezeti konfiguráció

### `environment.ts` (fejlesztés)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

### `environment.prod.ts` (produkció)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-url.com/api'
};
```

---

## 4. Modellek (TypeScript interfészek)

### `User`
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: 'user' | 'admin' | 'barber';
  created_at?: string;
  updated_at?: string;
}
```

### `Barber`
```typescript
export interface Barber {
  id: number;
  user_id: number | null;
  name: string;
  specialization: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}
```

### `Booking`
```typescript
export interface Booking {
  id: number;
  barber_id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  barber?: Barber;
  created_at?: string;
  updated_at?: string;
}

export interface BookingRequest {
  barber_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note?: string;
}
```

### `Hairstyle`
```typescript
export interface Hairstyle {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration_min: number;
  created_at?: string;
  updated_at?: string;
}
```

### `GalleryImage`
```typescript
export interface GalleryImage {
  id: number;
  title: string | null;
  image_url: string;
  source: string | null;
  created_at?: string;
  updated_at?: string;
}
```

---

## 5. Szolgáltatások (Services)

Minden szolgáltatás az `ApiService` absztrakt osztályból öröklődik, ami egységes HTTP metódusokat biztosít.

### 5.1 `ApiService` (alap)

```typescript
export class ApiService {
  protected baseUrl = environment.apiUrl;
  
  protected get<T>(path: string, params?: any): Observable<T>;
  protected post<T>(path: string, body?: any): Observable<T>;
  protected put<T>(path: string, body?: any): Observable<T>;
  protected delete<T>(path: string): Observable<T>;
}
```

### 5.2 `AuthService`

Az autentikáció kezelése, a token tárolása `localStorage`-ban.

| Metódus | Leírás |
|---|---|
| `register(data)` | Regisztráció |
| `login(data)` | Bejelentkezés (token mentése) |
| `logout()` | Kijelentkezés (token törlése) |
| `me()` | Bejelentkezett felhasználó lekérése |
| `forgotPassword(data)` | Jelszó-visszaállítási link kérése |
| `resetPassword(data)` | Jelszó visszaállítása |
| `resendVerification()` | E-mail verifikáció újraküldése |

**Reaktív állapot:**
- `currentUser$: Observable<User | null>` – BehaviorSubject az aktuális felhasználóhoz
- `isLoggedIn: boolean` – getter
- `isAdmin: boolean` – getter
- `isBarber: boolean` – getter

### 5.3 `BarbersService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getAll()` | GET `/barbers` | Összes borbély |
| `getById(id)` | GET `/barbers/{id}` | Egy borbély |
| `getNextSlot(barberId)` | GET `/barbers/{id}/next-slot` | Következő szabad idő |
| `getSchedule(barberId, dateFrom, dateTo)` | GET `/barbers/{id}/schedule` | Foglalási naptár |
| `create(data)` | POST `/barbers` | Új borbély (admin) |
| `update(id, data)` | PUT `/barbers/{id}` | Módosítás (admin) |
| `remove(id)` | DELETE `/barbers/{id}` | Törlés (admin) |

### 5.4 `BookingsService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getAll()` | GET `/bookings` | Saját / összes foglalás |
| `getById(id)` | GET `/bookings/{id}` | Egy foglalás |
| `create(data)` | POST `/bookings` | Új foglalás |
| `update(id, data)` | PUT `/bookings/{id}` | Módosítás (admin) |
| `remove(id)` | DELETE `/bookings/{id}` | Lemondás |
| `getAvailability(barberId, dateFrom, dateTo)` | GET `/availability` | Szabad idők |
| `getDaySchedule(barberId, date, duration)` | GET `/day-schedule` | Napi beosztás |
| `getSosSlots(duration?, count?)` | GET `/sos-slots` | SOS foglalás |

**Interfészek:**
```typescript
export interface DayScheduleSlot {
  time: string;           // "09:00"
  datetime: string;       // ISO 8601
  status: 'available' | 'booked' | 'break' | 'past';
}

export interface SosSlot {
  barber_id: number;
  barber_name: string;
  barber_photo: string | null;
  barber_specialization: string | null;
  datetime: string;
  date: string;
  time: string;
  duration_min: number;
}
```

### 5.5 `BarberBookingsService`

A borbély saját dashboard-jához tartozó API hívások.

| Metódus | API hívás | Leírás |
|---|---|---|
| `getMyBarberProfile()` | GET `/barber/me` | Saját borbély profil |
| `getMyBookings()` | GET `/barber/bookings` | Saját foglalások |
| `updateBooking(id, data)` | PUT `/barber/bookings/{id}` | Foglalás módosítás |
| `cancelBooking(id)` | DELETE `/barber/bookings/{id}` | Foglalás lemondás |
| `getMyBreaks()` | GET `/barber/breaks` | Saját szünetek |
| `createBreak(data)` | POST `/barber-breaks` | Szünet létrehozás |
| `updateBreak(id, data)` | PUT `/barber-breaks/{id}` | Szünet módosítás |
| `deleteBreak(id)` | DELETE `/barber-breaks/{id}` | Szünet törlés |

### 5.6 `BarberBreaksService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getByBarber(barberId)` | GET `/barbers/{id}/breaks` | Borbély szünetei |
| `create(data)` | POST `/barber-breaks` | Új szünet |
| `remove(id)` | DELETE `/barber-breaks/{id}` | Szünet törlés |

### 5.7 `GalleryService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getAll()` | GET `/gallery` | Összes kép |
| `create(data)` | POST `/gallery` | Kép feltöltés (admin) |
| `remove(id)` | DELETE `/gallery/{id}` | Kép törlés (admin) |

### 5.8 `HairstylesService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getAll()` | GET `/hairstyles` | Összes frizura |
| `getById(id)` | GET `/hairstyles/{id}` | Egy frizura |
| `create(data)` | POST `/hairstyles` | Létrehozás (admin) |
| `update(id, data)` | PUT `/hairstyles/{id}` | Módosítás (admin) |
| `remove(id)` | DELETE `/hairstyles/{id}` | Törlés (admin) |

### 5.9 `UsersService`

| Metódus | API hívás | Leírás |
|---|---|---|
| `getAll()` | GET `/users` | Összes felhasználó (admin) |
| `getById(id)` | GET `/users/{id}` | Egy felhasználó (admin) |
| `update(id, data)` | PUT `/users/{id}` | Módosítás (admin) |
| `remove(id)` | DELETE `/users/{id}` | Törlés (admin) |

---

## 6. HTTP Interceptor

### `authInterceptor`

Funkcionális interceptor (`HttpInterceptorFn`), amely minden kimenő HTTP kéréshez:
1. Hozzáadja a `withCredentials: true` beállítást (CORS cookie-k)
2. Ha van token a `localStorage`-ban, csatolja a `Authorization: Bearer <token>` fejlécet

---

## 7. Route Guard-ok

Az alkalmazás 5 guard-ot definiál funkcionális `CanActivateFn` formátumban:

| Guard | Leírás | Átirányítás |
|---|---|---|
| `authGuard` | Csak bejelentkezett felhasználók | → `/login` |
| `adminGuard` | Csak admin felhasználók | → `/` |
| `barberGuard` | Borbély vagy admin | → `/` |
| `guestGuard` | Csak NEM bejelentkezett felhasználók | → `/` |
| `notBarberGuard` | Mindenki, KIVÉVE borbély | → `/barber-dashboard` |

---

## 8. Útvonalak (Routes)

| Útvonal | Komponens | Guard | Leírás |
|---|---|---|---|
| `/` | `HomeComponent` | notBarberGuard | Főoldal |
| `/login` | `LoginComponent` | guestGuard | Bejelentkezés |
| `/register` | `RegisterComponent` | guestGuard | Regisztráció |
| `/forgot-password` | `ForgotPasswordComponent` | – | Elfelejtett jelszó |
| `/reset-password` | `ResetPasswordComponent` | – | Jelszó visszaállítás |
| `/verify-email/:id/:hash` | `VerifyEmailComponent` | – | E-mail megerősítés |
| `/booking/:barberId` | `BookingComponent` | notBarberGuard | Időpont foglalás |
| `/booking-success` | `BookingSuccessComponent` | notBarberGuard | Sikeres foglalás |
| `/gallery` | `GalleryComponent` | notBarberGuard | Galéria |
| `/about` | `AboutComponent` | notBarberGuard | Rólunk |
| `/admin` | `AdminComponent` | adminGuard | Admin felület |
| `/barber-dashboard` | `BarberDashboardComponent` | barberGuard | Borbély dashboard |
| `/copyright` | `CopyrightComponent` | – | Szerzői jogi nyilatkozat |
| `**` | – | – | Átirányítás → `/` |

---

## 9. Oldalak (Pages)

### 9.1 `HomeComponent`
A főoldal, amely bemutatja a borbélyüzletet, listázza a borbélyokat és az SOS foglalás lehetőségét.

### 9.2 `BookingComponent`
Időpont foglalási folyamat: borbély kiválasztása → dátum/idő választás (napi beosztás) → adatok megadása → foglalás.

### 9.3 `BookingSuccessComponent`
Sikeres foglalás utáni visszaigazoló oldal.

### 9.4 `GalleryComponent`
Képgaléria a korábbi munkákról. A képek a backend API-ról töltődnek be abszolút URL-ekkel.

### 9.5 `AboutComponent`
Információs oldal az üzletről.

### 9.6 `AdminComponent`
Admin felület: felhasználók, borbélyok, frizurák, foglalások és galéria kezelése.

### 9.7 `BarberDashboardComponent`
Borbélyok számára: saját foglalások kezelése, szünetek beállítása.

### 9.8 Auth oldalak
- **Login** – E-mail + jelszó bejelentkezés
- **Register** – Regisztráció jelszó megerősítéssel
- **ForgotPassword** – E-mail megadása jelszó-visszaállításhoz
- **ResetPassword** – Új jelszó beállítása tokennel
- **VerifyEmail** – E-mail cím megerősítése

### 9.9 `CopyrightComponent`
Szerzői jogi nyilatkozat, csak a lábléc linkjéből érhető el.

---

## 10. Megosztott komponensek

| Komponens | Leírás |
|---|---|
| `NavbarComponent` | Navigációs sáv, felhasználó állapot kezelés (login/logout), szerepkör-alapú menüpontok |
| `FooterComponent` | Lábléc, szerzői jogi link (`/copyright`) |
| `BarberCardComponent` | Borbély kártya (név, fotó, szakterület, következő szabad idő) |
| `ToastComponent` | Értesítő üzenetek (sikeres művelet, hiba, stb.) |

---


## 11. Fontos technikai részletek

### Token kezelés
- A bearer token a `localStorage`-ban tárolódik `auth_token` kulccsal
- Automatikusan csatolódik minden API kéréshez az `authInterceptor`-on keresztül
- Kijelentkezéskor törlődik

### Szerepkör-alapú hozzáférés
- **Borbély** felhasználók automatikusan a `/barber-dashboard`-ra irányítódnak (`notBarberGuard`)
- **Admin** felhasználók hozzáférnek az admin felülethez és a borbély funkciókhoz is
- **Normál felhasználók** és vendégek használhatják a foglalási rendszert

### API kommunikáció
- Minden API hívás az `environment.apiUrl` (`http://localhost:8000/api`) bázis URL-re épül
- A `withCredentials: true` beállítás biztosítja a CORS cookie-k kezelését
- Az API JSON formátumban kommunikál
