# BarberShop Frontend – Részletes Dokumentáció

> **Projekt neve:** barbershop-frontend  
> **Verzió:** 0.0.0  
> **Keretrendszer:** Angular 17.3 (Standalone Components)  
> **Nyelv:** TypeScript 5.4  
> **Stílus:** SCSS + Bootstrap 5.3 + Bootstrap Icons  
> **Készítette:** Mtblnt01  
> **Utolsó frissítés:** 2026. március 23.

---

## Tartalomjegyzék

1. [Projekt áttekintés](#1-projekt-áttekintés)
2. [Technológiai stack](#2-technológiai-stack)
3. [Mappastruktúra](#3-mappastruktúra)
4. [Alkalmazás konfiguráció](#4-alkalmazás-konfiguráció)
5. [Routing (Útvonalkezelés)](#5-routing-útvonalkezelés)
6. [Core modul](#6-core-modul)
   - 6.1 [Modellek](#61-modellek-adatmodellek)
   - 6.2 [Szolgáltatások (Services)](#62-szolgáltatások-services)
   - 6.3 [Guards (Útvonalvédelem)](#63-guards-útvonalvédelem)
   - 6.4 [Interceptors](#64-interceptors)
7. [Oldalak (Pages)](#7-oldalak-pages)
   - 7.1 [Home (Főoldal)](#71-home-főoldal)
   - 7.2 [Booking (Foglalás)](#72-booking-időpontfoglalás)
   - 7.3 [Booking Success (Sikeres foglalás)](#73-booking-success-sikeres-foglalás)
   - 7.4 [Gallery (Galéria)](#74-gallery-galéria)
   - 7.5 [About (Rólunk)](#75-about-rólunk)
   - 7.6 [Admin (Admin panel)](#76-admin-felület)
   - 7.7 [Autentikációs oldalak](#77-autentikációs-oldalak)
8. [Megosztott komponensek (Shared)](#8-megosztott-komponensek-shared)
9. [Környezeti változók](#9-környezeti-változók-environments)
10. [Stíluskezelés](#10-stíluskezelés)
11. [Indítás és build](#11-indítás-és-build)
12. [API kommunikáció összefoglaló](#12-api-kommunikáció-összefoglaló)

---

## 1. Projekt áttekintés

A **BarberShop Frontend** egy modern, egyoldalas webalkalmazás (SPA), amely egy borbélyüzlet online foglalási rendszerének felhasználói felületét biztosítja. Az alkalmazás lehetővé teszi:

- **Borbélyok böngészését** – A felhasználók megtekinthetik az elérhető borbélyokat, specializációjukat és a legközelebbi szabad időpontjukat.
- **Online időpontfoglalást** – Az ügyfelek egy kiválasztott borbélynál tudnak foglalást leadni, megadva nevüket, e-mail címüket, telefonszámukat és a kívánt időpontot.
- **SOS foglalást** – Gyors időpont a legkorábbi szabad borbélynál, egyetlen kattintással.
- **Galéria megtekintését** – Munkák és hajstílusok képgalériája.
- **Felhasználói regisztrációt és bejelentkezést** – Teljes autentikációs folyamat e-mail megerősítéssel és jelszó-visszaállítással.
- **Admin felületet** – Adminisztrátorok számára borbélyok, foglalások, hajstílusok és galériaképek kezelése.

Az alkalmazás egy Laravel backend API-val kommunikál (`http://localhost:8000/api`).

---

## 2. Technológiai stack

| Technológia | Verzió | Leírás |
|---|---|---|
| **Angular** | 17.3 | Frontend keretrendszer (Standalone Components) |
| **TypeScript** | 5.4 | Típusbiztos JavaScript |
| **RxJS** | 7.8 | Reaktív programozás – Observable-ök kezelése |
| **Bootstrap** | 5.3.8 | CSS keretrendszer – reszponzív design |
| **Bootstrap Icons** | 1.13.1 | Ikon könyvtár |
| **SCSS** | – | CSS preprocesszor |
| **Zone.js** | 0.14.3 | Angular change detection |
| **Karma + Jasmine** | – | Tesztelési keretrendszer |

### Főbb Angular jellemzők
- **Standalone Components** – Nincs NgModule, minden komponens önálló (`standalone: true`)
- **Functional Guards** – `CanActivateFn` típusú route guardok
- **Functional Interceptors** – `HttpInterceptorFn` típusú interceptorok
- **`provideRouter` / `provideHttpClient`** – Modern DI alapú konfiguráció

---

## 3. Mappastruktúra

```
barbershop-frontend/
├── src/
│   ├── index.html                     # HTML belépési pont
│   ├── main.ts                        # Angular bootstrap
│   ├── styles.scss                    # Globális stílusok
│   ├── favicon.ico
│   │
│   ├── app/
│   │   ├── app.component.ts/html/scss # Gyökér komponens
│   │   ├── app.config.ts              # Alkalmazás konfiguráció (providers)
│   │   ├── app.routes.ts              # Útvonalak definíciója
│   │   │
│   │   ├── core/                      # Központi üzleti logika
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # authGuard, adminGuard, guestGuard
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts # HTTP interceptor (withCredentials)
│   │   │   ├── models/                # TypeScript interfészek
│   │   │   │   ├── barber.model.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── gallery.model.ts
│   │   │   │   ├── hairstyle.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   └── index.ts           # Barrel export
│   │   │   └── services/              # API szolgáltatások
│   │   │       ├── api.service.ts     # Alap HTTP service (abstract)
│   │   │       ├── auth.service.ts    # Autentikáció
│   │   │       ├── barbers.service.ts # Borbélyok CRUD
│   │   │       ├── bookings.service.ts# Foglalások CRUD
│   │   │       ├── gallery.service.ts # Galéria CRUD
│   │   │       ├── hairstyles.service.ts # Hajstílusok CRUD
│   │   │       └── index.ts           # Barrel export
│   │   │
│   │   ├── pages/                     # Oldal komponensek
│   │   │   ├── home/                  # Főoldal
│   │   │   ├── booking/               # Foglalási űrlap
│   │   │   ├── booking-success/       # Sikeres foglalás visszajelzés
│   │   │   ├── gallery/               # Galéria oldal
│   │   │   ├── about/                 # Rólunk oldal
│   │   │   ├── admin/                 # Admin panel
│   │   │   └── auth/                  # Autentikációs oldalak
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       ├── forgot-password/
│   │   │       ├── reset-password/
│   │   │       └── verify-email/
│   │   │
│   │   └── shared/                    # Megosztott komponensek
│   │       └── components/
│   │           ├── navbar/            # Navigációs sáv
│   │           ├── footer/            # Lábléc
│   │           ├── barber-card/       # Borbély kártya
│   │           └── toast/             # Értesítő üzenet
│   │
│   ├── assets/                        # Statikus fájlok
│   └── environments/
│       ├── environment.ts             # Fejlesztői környezet
│       └── environment.prod.ts        # Produkciós környezet
│
├── angular.json                       # Angular CLI konfiguráció
├── package.json                       # NPM függőségek
├── tsconfig.json                      # TypeScript alap konfiguráció
├── tsconfig.app.json                  # App-specifikus TS konfig
└── tsconfig.spec.json                 # Teszt-specifikus TS konfig
```

---

## 4. Alkalmazás konfiguráció

### `app.config.ts`

Az alkalmazás konfigurációja a modern Angular 17 `ApplicationConfig` mintát követi:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

**Funkciók:**
- **`provideRouter`** – Útvonalak regisztrálása anchor scrolling és scroll pozíció visszaállítás támogatással.
- **`provideHttpClient`** – HTTP kliens regisztrálása az `authInterceptor` interceptorral.

### `app.component.ts`

A gyökér komponens felelős:
- **Layout vezérlésért** – A navbar és footer megjelenítése az aktuális útvonal alapján (autentikációs oldalakon elrejtve).
- **Felhasználó betöltéséért** – Az `ngOnInit`-ben meghívja az `AuthService.me()` metódust az aktuális munkamenet ellenőrzéséhez.

```typescript
private authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
```

Ha az aktuális útvonal az `authRoutes` valamelyikével kezdődik, a navbar és footer elrejtésre kerül.

---

## 5. Routing (Útvonalkezelés)

### `app.routes.ts`

| Útvonal | Komponens | Guard | Leírás |
|---|---|---|---|
| `/` | `HomeComponent` | – | Főoldal: Hero, SOS foglalás, borbélyok listája |
| `/login` | `LoginComponent` | `guestGuard` | Bejelentkezés (csak vendégek) |
| `/register` | `RegisterComponent` | `guestGuard` | Regisztráció (csak vendégek) |
| `/forgot-password` | `ForgotPasswordComponent` | – | Elfelejtett jelszó |
| `/reset-password` | `ResetPasswordComponent` | – | Jelszó visszaállítás |
| `/verify-email/:id/:hash` | `VerifyEmailComponent` | – | E-mail cím megerősítés |
| `/booking/:barberId` | `BookingComponent` | – | Időpontfoglalás adott borbélynál |
| `/booking-success` | `BookingSuccessComponent` | – | Sikeres foglalás visszajelzés |
| `/gallery` | `GalleryComponent` | – | Galéria |
| `/about` | `AboutComponent` | – | Rólunk |
| `/admin` | `AdminComponent` | `adminGuard` | Admin panel (csak admin felhasználók) |
| `**` | redirect → `/` | – | Ismeretlen útvonalak átirányítása |

---

## 6. Core modul

A `core/` mappa tartalmazza az alkalmazás központi üzleti logikáját: adatmodellek, szolgáltatások, guardok és interceptorok.

### 6.1 Modellek (Adatmodellek)

Az összes modell TypeScript `interface`-ként van definiálva a `core/models/` mappában.

#### `User` – Felhasználó
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_admin?: boolean;
}
```

#### `Barber` – Borbély
```typescript
interface Barber {
  id: number;
  name: string;
  specialization: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}
```

#### `Booking` – Foglalás
```typescript
interface Booking {
  id: number;
  barber_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note: string | null;
  status: 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}
```

#### `BookingRequest` – Foglalási kérés
```typescript
interface BookingRequest {
  barber_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note?: string;
}
```

#### `Hairstyle` – Hajstílus
```typescript
interface Hairstyle {
  id: number;
  name: string;
  description: string | null;
  price_from: number | null;
  created_at?: string;
  updated_at?: string;
}
```

#### `GalleryImage` – Galéria kép
```typescript
interface GalleryImage {
  id: number;
  title: string | null;
  image_url: string;
  source: string | null;
  created_at?: string;
  updated_at?: string;
}
```

#### Autentikációs kérések
| Interfész | Mezők |
|---|---|
| `LoginRequest` | `email`, `password` |
| `RegisterRequest` | `name`, `email`, `password`, `password_confirmation` |
| `ForgotPasswordRequest` | `email` |
| `ResetPasswordRequest` | `token`, `email`, `password`, `password_confirmation` |

---

### 6.2 Szolgáltatások (Services)

#### `ApiService` – Alap HTTP szolgáltatás

Minden domain-specifikus service ebből öröklődik. Tartalmazza a közös HTTP metódusokat:

| Metódus | Leírás |
|---|---|
| `get<T>(path, params)` | GET kérés az API-hoz |
| `post<T>(path, body)` | POST kérés |
| `put<T>(path, body)` | PUT kérés |
| `delete<T>(path)` | DELETE kérés |

Az alap URL a `environment.apiUrl`-ből származik.

---

#### `AuthService` – Autentikációs szolgáltatás

**State management:** `BehaviorSubject<User | null>` az aktuális felhasználó nyilvántartására.

| Tulajdonság / Metódus | Típus | Leírás |
|---|---|---|
| `currentUser$` | `Observable<User \| null>` | Felhasználó állapot stream |
| `currentUser` | getter | Aktuális felhasználó szinkron lekérése |
| `isLoggedIn` | getter → `boolean` | Be van-e jelentkezve |
| `isAdmin` | getter → `boolean` | Admin-e a felhasználó |
| `register(data)` | `Observable<any>` | Regisztráció |
| `login(data)` | `Observable<any>` | Bejelentkezés + felhasználó beállítása |
| `logout()` | `Observable<any>` | Kijelentkezés + felhasználó nullázása |
| `me()` | `Observable<User>` | Aktuális felhasználó lekérése (session check) |
| `forgotPassword(data)` | `Observable<any>` | Jelszó-visszaállító link küldése |
| `resetPassword(data)` | `Observable<any>` | Jelszó visszaállítás |
| `resendVerification()` | `Observable<any>` | E-mail megerősítés újraküldése |
| `setUser(user)` | `void` | Felhasználó manuális beállítása |

---

#### `BarbersService` – Borbélyok szolgáltatás

Öröklődik: `ApiService`

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getAll()` | `GET /barbers` | Összes borbély lekérése |
| `getById(id)` | `GET /barbers/:id` | Egy borbély lekérése |
| `getNextSlot(barberId)` | `GET /barbers/:id/next-slot` | Legközelebbi szabad időpont |
| `getSchedule(barberId, dateFrom, dateTo)` | `GET /barbers/:id/schedule` | Borbély beosztása |
| `create(data)` | `POST /barbers` | Új borbély létrehozása |
| `update(id, data)` | `PUT /barbers/:id` | Borbély módosítása |
| `remove(id)` | `DELETE /barbers/:id` | Borbély törlése |

---

#### `BookingsService` – Foglalások szolgáltatás

Öröklődik: `ApiService`

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getAll()` | `GET /bookings` | Összes foglalás lekérése |
| `getById(id)` | `GET /bookings/:id` | Egy foglalás lekérése |
| `create(data)` | `POST /bookings` | Új foglalás létrehozása |
| `update(id, data)` | `PUT /bookings/:id` | Foglalás módosítása |
| `remove(id)` | `DELETE /bookings/:id` | Foglalás törlése |
| `getAvailability(barberId, dateFrom, dateTo)` | `GET /availability` | Szabad időpontok lekérdezése |

---

#### `HairstylesService` – Hajstílusok szolgáltatás

Öröklődik: `ApiService`

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getAll()` | `GET /hairstyles` | Összes hajstílus |
| `getById(id)` | `GET /hairstyles/:id` | Egy hajstílus |
| `create(data)` | `POST /hairstyles` | Létrehozás |
| `update(id, data)` | `PUT /hairstyles/:id` | Módosítás |
| `remove(id)` | `DELETE /hairstyles/:id` | Törlés |

---

#### `GalleryService` – Galéria szolgáltatás

Öröklődik: `ApiService`

| Metódus | Endpoint | Leírás |
|---|---|---|
| `getAll()` | `GET /gallery` | Összes kép |
| `create(data)` | `POST /gallery` | Kép feltöltése |
| `remove(id)` | `DELETE /gallery/:id` | Kép törlése |

---

### 6.3 Guards (Útvonalvédelem)

Mindhárom guard `CanActivateFn` típusú (Angular 17 functional guard).

#### `authGuard`
- **Cél:** Csak bejelentkezett felhasználók érhetik el a védett útvonalakat.
- **Működés:** Ha a felhasználó nincs bejelentkezve → átirányítás a `/login` oldalra a `returnUrl` query paraméterrel.

#### `adminGuard`
- **Cél:** Csak admin felhasználók érhetik el az admin felületet.
- **Működés:** Ha a felhasználó nincs bejelentkezve VAGY nem admin → átirányítás a `/` főoldalra.

#### `guestGuard`
- **Cél:** Csak vendég (ki nem jelentkezett) felhasználók érhetik el a login/register oldalt.
- **Működés:** Ha a felhasználó be van jelentkezve → átirányítás a `/` főoldalra.

---

### 6.4 Interceptors

#### `authInterceptor`

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({ withCredentials: true });
  return next(cloned);
};
```

**Működés:** Minden kimenő HTTP kéréshez hozzáadja a `withCredentials: true` opciót, ami lehetővé teszi a cookie-alapú autentikáció (Laravel Sanctum) működését cross-origin kéréseknél.

---

## 7. Oldalak (Pages)

### 7.1 Home (Főoldal)

**Komponens:** `HomeComponent`  
**Útvonal:** `/`

**Szekciók:**
1. **Hero Section** – Üdvözlő szekció animált háttérrel, nagy címsorral és CTA gombbal.
2. **SOS Foglalás** – Gyors időpont az első elérhető borbélynál.
3. **Borbélyok listája** – `BarberCardComponent` használatával jeleníti meg az elérhető borbélyokat, mindegyiknél a legközelebbi szabad időponttal.
4. **"Miért minket válassz?"** – Három oszlopos feature szekció (Online foglalás, E-mail értesítések, Prémium minőség).

**Adatbetöltés:**
- `BarbersService.getAll()` – Borbélyok lekérése.
- `BarbersService.getNextSlot(barberId)` – Minden borbélyhoz a következő szabad időpont betöltése.

---

### 7.2 Booking (Időpontfoglalás)

**Komponens:** `BookingComponent`  
**Útvonal:** `/booking/:barberId`

**Funkciók:**
- Borbély adatainak megjelenítése (név, fotó, specializáció).
- Foglalási űrlap mezői:
  - **Teljes név** (kötelező)
  - **E-mail cím** (kötelező)
  - **Telefonszám** (kötelező)
  - **Időpont** (`datetime-local` input, kötelező)
  - **Időtartam** (30 / 45 / 60 perc, lenyíló lista)
  - **Hajstílus** (opcionális, lenyíló lista – `HairstylesService`-ből töltődik)
  - **Megjegyzés** (opcionális szövegmező)
- **Szerver oldali validáció** – Hibák megjelenítése az egyes mezők alatt.
- Sikeres foglalás után átirányítás a `/booking-success` oldalra a foglalás és borbély adataival.

---

### 7.3 Booking Success (Sikeres foglalás)

**Komponens:** `BookingSuccessComponent`  
**Útvonal:** `/booking-success`

**Működés:**
- A `Router` state-jéből olvassa ki a foglalás (`booking`) és borbély (`barber`) adatait.
- Ha nincs foglalási adat a state-ben (pl. direkt URL-elérés), átirányít a főoldalra.
- Visszaigazolást jelenít meg a foglalás részleteivel.

---

### 7.4 Gallery (Galéria)

**Komponens:** `GalleryComponent`  
**Útvonal:** `/gallery`

**Funkciók:**
- Képek betöltése a `GalleryService.getAll()` hívással.
- Képek rács elrendezésben való megjelenítése.
- **Lightbox funkció** – Kattintásra a kép nagyított nézetben jelenik meg (`selectedImage` / `openImage()` / `closeImage()`).
- Loading spinner a betöltés idejére.

---

### 7.5 About (Rólunk)

**Komponens:** `AboutComponent`  
**Útvonal:** `/about`

Statikus tájékoztató oldal a borbélyüzletről. Nincs szerverhívás vagy dinamikus logika.

---

### 7.6 Admin felület

**Komponens:** `AdminComponent`  
**Útvonal:** `/admin`  
**Guard:** `adminGuard` – Csak admin jogosultságú felhasználók érik el.

**Funkciók:**
- **Tab-alapú navigáció** (`activeTab` property):
  - `barbers` – Borbélyok kezelése
  - `bookings` – Foglalások kezelése
  - `hairstyles` – Hajstílusok kezelése
  - `gallery` – Galéria képek kezelése
- **CRUD műveletek** – Minden entitáshoz listázás és törlés (megerősítő dialógussal).
- Az adatok az `ngOnInit`-ben töltődnek be egyszerre.

| Művelet | Szolgáltatás hívás |
|---|---|
| Borbélyok betöltése | `barbersService.getAll()` |
| Foglalások betöltése | `bookingsService.getAll()` |
| Hajstílusok betöltése | `hairstylesService.getAll()` |
| Galéria betöltése | `galleryService.getAll()` |
| Borbély törlése | `barbersService.remove(id)` |
| Foglalás törlése | `bookingsService.remove(id)` |
| Hajstílus törlése | `hairstylesService.remove(id)` |
| Kép törlése | `galleryService.remove(id)` |

---

### 7.7 Autentikációs oldalak

#### Login (Bejelentkezés)
- **Útvonal:** `/login` (guestGuard)
- **Mezők:** E-mail, Jelszó
- **Logika:** `AuthService.login()` hívás → sikeres bejelentkezés után átirányítás a főoldalra.

#### Register (Regisztráció)
- **Útvonal:** `/register` (guestGuard)
- **Mezők:** Név, E-mail, Jelszó, Jelszó megerősítés
- **Logika:** `AuthService.register()` hívás → sikeres regisztráció után visszajelzés (e-mail megerősítés szükséges).
- **Validáció:** Szerver oldali hibák mezőnkénti megjelenítése.

#### Forgot Password (Elfelejtett jelszó)
- **Útvonal:** `/forgot-password`
- **Mezők:** E-mail
- **Logika:** `AuthService.forgotPassword()` → jelszó-visszaállító link küldése e-mailben.

#### Reset Password (Jelszó visszaállítás)
- **Útvonal:** `/reset-password`
- **Query paraméterek:** `token`, `email` (az e-mail linkből)
- **Mezők:** Jelszó, Jelszó megerősítés
- **Logika:** `AuthService.resetPassword()` → jelszó módosítása.

#### Verify Email (E-mail megerősítés)
- **Útvonal:** `/verify-email/:id/:hash`
- **Logika:** Automatikus GET kérés a backend felé az `id` és `hash` paraméterekkel. Sikeres/sikertelen visszajelzés megjelenítése.

---

## 8. Megosztott komponensek (Shared)

### `NavbarComponent`
- **Selector:** `app-navbar`
- **Megjelenés:** Reszponzív navigációs sáv Bootstrap alapon.
- **Funkciók:**
  - Hamburger menü kezelése (`isMenuOpen` toggle).
  - Feltételes menüelemek az `AuthService` alapján (bejelentkezett/vendég felhasználó).
  - Kijelentkezés gomb (`logout()` metódus → teljes oldal újratöltés `window.location.href = '/'`).

### `FooterComponent`
- **Selector:** `app-footer`
- **Megjelenés:** Oldal lábléc az aktuális évszámmal (`currentYear`).

### `BarberCardComponent`
- **Selector:** `app-barber-card`
- **Input-ok:**
  - `barber: Barber` – A borbély adatai.
  - `nextSlot: string | null` – A legközelebbi szabad időpont.
- **Megjelenés:** Kártya nézet a borbély fotójával, nevével, specializációjával és a következő szabad időponttal + foglalás gomb.

### `ToastComponent`
- **Selector:** `app-toast`
- **Input:** `message: ToastMessage | null` – Az üzenet szövege és típusa.
- **Output:** `dismissed` – Esemény az üzenet bezárásakor.
- **Típusok:** `success`, `error`, `info`, `warning` – Mindegyikhez saját ikon és háttérszín.

---

## 9. Környezeti változók (Environments)

### Fejlesztői környezet (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

### Produkciós környezet (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

A fejlesztői környezetben az API a `localhost:8000` porton fut (Laravel dev szerver), míg produkciós környezetben relatív `/api` útvonalat használ (azonos szerveren).

---

## 10. Stíluskezelés

### Globális stílusok (`styles.scss`)

- **Bootstrap SCSS** teljes importálása (`@import 'bootstrap/scss/bootstrap'`).
- **Bootstrap Icons** CSS betöltése.
- **Egyedi globális stílusok:**
  - CSS reset (`*` margin/padding/box-sizing)
  - Alap betűtípus: `Segoe UI`
  - Háttérszín: `#f8f9fa` (világos szürke)
  - Smooth scroll viselkedés
  - Egyedi scrollbar design arany (`#c8a97e`) színnel
  - Link szín: arany (`#c8a97e`) hover: sötétebb arany (`#b8955e`)

### Szín paletta
| Szín | Hex kód | Használat |
|---|---|---|
| Arany (primary) | `#c8a97e` | Linkek, scrollbar, kiemelések |
| Arany (hover) | `#b8955e` | Hover állapotok |
| Világos szürke | `#f8f9fa` | Háttér |
| Sötét | Bootstrap `dark` | Gombok, navigáció |

---

## 11. Indítás és build

### Előfeltételek
- **Node.js** (18+ ajánlott)
- **npm** (csomagkezelő)

### Telepítés
```bash
cd barbershop-frontend
npm install
```

### Fejlesztői szerver indítása
```bash
npm start
# vagy
ng serve --open
```
Az alkalmazás a **http://localhost:4200/** címen érhető el.

### Produkciós build
```bash
npm run build
```
A build a `dist/` mappába kerül.

### Tesztek futtatása
```bash
npm test
```

---

## 12. API kommunikáció összefoglaló

Az alkalmazás a következő API végpontokkal kommunikál (Laravel backend):

### Autentikáció
| Metódus | Endpoint | Leírás |
|---|---|---|
| `POST` | `/api/auth/register` | Regisztráció |
| `POST` | `/api/auth/login` | Bejelentkezés |
| `POST` | `/api/auth/logout` | Kijelentkezés |
| `GET` | `/api/auth/me` | Aktuális felhasználó |
| `POST` | `/api/auth/forgot-password` | Jelszó-visszaállító link |
| `POST` | `/api/auth/reset-password` | Jelszó visszaállítás |
| `POST` | `/api/email/resend` | E-mail megerősítés újraküldés |
| `GET` | `/api/email/verify/:id/:hash` | E-mail megerősítés |

### Borbélyok
| Metódus | Endpoint | Leírás |
|---|---|---|
| `GET` | `/api/barbers` | Összes borbély |
| `GET` | `/api/barbers/:id` | Egy borbély |
| `GET` | `/api/barbers/:id/next-slot` | Következő szabad időpont |
| `GET` | `/api/barbers/:id/schedule` | Borbély beosztása |
| `POST` | `/api/barbers` | Borbély létrehozása |
| `PUT` | `/api/barbers/:id` | Borbély módosítása |
| `DELETE` | `/api/barbers/:id` | Borbély törlése |

### Foglalások
| Metódus | Endpoint | Leírás |
|---|---|---|
| `GET` | `/api/bookings` | Összes foglalás |
| `GET` | `/api/bookings/:id` | Egy foglalás |
| `POST` | `/api/bookings` | Foglalás létrehozása |
| `PUT` | `/api/bookings/:id` | Foglalás módosítása |
| `DELETE` | `/api/bookings/:id` | Foglalás törlése |
| `GET` | `/api/availability` | Szabad időpontok |

### Hajstílusok
| Metódus | Endpoint | Leírás |
|---|---|---|
| `GET` | `/api/hairstyles` | Összes hajstílus |
| `GET` | `/api/hairstyles/:id` | Egy hajstílus |
| `POST` | `/api/hairstyles` | Létrehozás |
| `PUT` | `/api/hairstyles/:id` | Módosítás |
| `DELETE` | `/api/hairstyles/:id` | Törlés |

### Galéria
| Metódus | Endpoint | Leírás |
|---|---|---|
| `GET` | `/api/gallery` | Összes kép |
| `POST` | `/api/gallery` | Kép feltöltése |
| `DELETE` | `/api/gallery/:id` | Kép törlése |

---

> **Megjegyzés:** Az alkalmazás cookie-alapú autentikációt használ (Laravel Sanctum), amelyet az `authInterceptor` biztosít a `withCredentials: true` beállítással minden HTTP kérésnél.
