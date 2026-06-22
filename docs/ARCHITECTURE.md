# Hotel Nirvana Nest — Platform Design Document

Status: **DRAFT — awaiting approval before implementation begins**
Property: Hotel Nirvana Nest, B-4/103, Vishesh Khand 2, Gomti Nagar, Lucknow, UP 226010

---

## 1. Complete Project Architecture

### 1.1 Style
**Modular monolith** on Next.js 15 App Router. One deployable app, internally split into feature modules with hard boundaries (no cross-module imports of internals — only through each module's public `index.ts`). This avoids microservice overhead while keeping the codebase scalable and testable. Revisit splitting out a service (e.g. payments/notifications) only if traffic or team size demands it later.

### 1.2 Layers

```
┌─────────────────────────────────────────────────────────┐
│ Presentation        app/**/page.tsx, components/         │  React Server/Client Components
├─────────────────────────────────────────────────────────┤
│ Application         server actions, route handlers       │  orchestration, auth checks, DTO mapping
├─────────────────────────────────────────────────────────┤
│ Domain / Services    modules/*/service.ts                │  business rules (availability, pricing, locking)
├─────────────────────────────────────────────────────────┤
│ Data Access          modules/*/repository.ts (Mongoose)  │  queries, transactions, indexes
├─────────────────────────────────────────────────────────┤
│ Infrastructure        lib/db, lib/cache, lib/email, ...   │  Mongo, Redis, Cloudinary, Razorpay, Nodemailer
└─────────────────────────────────────────────────────────┘
```

Rules:
- UI never talks to Mongoose directly — always through a service function.
- Mutations from forms use **Server Actions**; routes that need to be called by webhooks (Razorpay), cron, or external clients use **Route Handlers** (`app/api/**/route.ts`).
- All business validation (Zod schemas) lives in `lib/validations/*` and is imported by both client forms and server actions/routes — single source of truth.
- Every write that touches booking/reservation availability runs inside a **Mongo session transaction**.

### 1.3 Request flow (booking example)
```
Client (RHF + Zod) → Server Action `createRoomBooking()`
   → auth/session check → input re-validated with Zod
   → BookingService.createBooking()
        → AvailabilityService.assertAvailable() [inside txn]
        → RoomBooking.create() [inside txn]
        → PaymentService.createRazorpayOrder()
   → returns { bookingId, razorpayOrderId }
Client → Razorpay Checkout → on success → Route Handler /api/payments/verify
   → verifies signature → PaymentService.confirmPayment()
        → marks booking CONFIRMED, payment CAPTURED
        → EmailService.sendBookingConfirmation() (queued, non-blocking)
```

### 1.4 Cross-cutting concerns
- **Auth**: JWT access (15 min) + refresh (30 days, rotated), both httpOnly/secure/sameSite=lax cookies. `middleware.ts` guards `/dashboard/**` and `/admin/**`, decodes access token, attaches role, redirects to refresh route if expired.
- **RBAC**: roles = `guest | customer | staff | admin`. Enforced both in `middleware.ts` (route-level) and in every service method (object-level — e.g. a customer can only cancel their own booking).
- **Caching**: TanStack Query on client; Redis (optional) for (a) room-availability read cache with short TTL, (b) distributed lock for booking/reservation creation when running >1 server instance. Without Redis, Mongo transactions + unique partial indexes are sufficient correctness-wise for a single-region deployment — Redis is a performance/multi-instance optimization, not a correctness requirement.
- **Observability**: structured logger (pino), request IDs, Sentry (or similar) for error tracking — added in implementation phase.
- **SEO**: per-page `generateMetadata`, JSON-LD (Hotel, Restaurant, Room/Product schema), dynamic `sitemap.ts`, `robots.ts`, OG images.

---

## 2. Folder Structure

```
nirvana-nest/
├─ docs/                              design docs (this file etc.)
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/                 public pages, shares a layout
│  │  │  ├─ page.tsx                  Home
│  │  │  ├─ rooms/
│  │  │  │  ├─ page.tsx               Rooms listing
│  │  │  │  └─ [slug]/page.tsx        Room details
│  │  │  ├─ restaurant/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ menu/page.tsx
│  │  │  ├─ gallery/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  ├─ reviews/page.tsx
│  │  │  └─ faq/page.tsx
│  │  ├─ (auth)/
│  │  │  ├─ login/page.tsx
│  │  │  ├─ register/page.tsx
│  │  │  ├─ forgot-password/page.tsx
│  │  │  └─ reset-password/[token]/page.tsx
│  │  ├─ (dashboard)/dashboard/
│  │  │  ├─ layout.tsx                guarded: customer|staff|admin
│  │  │  ├─ page.tsx                  overview
│  │  │  ├─ profile/page.tsx
│  │  │  ├─ bookings/page.tsx
│  │  │  ├─ reservations/page.tsx
│  │  │  ├─ favorites/page.tsx
│  │  │  └─ reviews/page.tsx
│  │  ├─ (admin)/admin/
│  │  │  ├─ layout.tsx                guarded: admin|staff (scoped)
│  │  │  ├─ page.tsx                  analytics
│  │  │  ├─ rooms/
│  │  │  ├─ bookings/
│  │  │  ├─ restaurant/
│  │  │  │  ├─ tables/
│  │  │  │  └─ reservations/
│  │  │  ├─ gallery/
│  │  │  ├─ reviews/
│  │  │  ├─ customers/
│  │  │  ├─ cms/
│  │  │  └─ settings/
│  │  ├─ api/
│  │  │  ├─ auth/[login|register|logout|refresh|forgot-password|reset-password]/route.ts
│  │  │  ├─ rooms/route.ts            GET list, POST create
│  │  │  ├─ rooms/[id]/route.ts       GET/PATCH/DELETE
│  │  │  ├─ rooms/availability/route.ts
│  │  │  ├─ bookings/route.ts
│  │  │  ├─ bookings/[id]/route.ts
│  │  │  ├─ bookings/[id]/cancel/route.ts
│  │  │  ├─ restaurant/tables/route.ts
│  │  │  ├─ restaurant/reservations/route.ts
│  │  │  ├─ restaurant/availability/route.ts
│  │  │  ├─ payments/order/route.ts
│  │  │  ├─ payments/verify/route.ts
│  │  │  ├─ payments/webhook/route.ts  Razorpay webhook
│  │  │  ├─ admin/analytics/route.ts
│  │  │  ├─ uploads/cloudinary-sign/route.ts
│  │  │  └─ sitemap.xml/route.ts (or app/sitemap.ts)
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ layout.tsx
│  ├─ modules/                        domain modules (the "real" backend)
│  │  ├─ auth/        {service, repository, types, validation}.ts
│  │  ├─ users/
│  │  ├─ rooms/
│  │  ├─ bookings/
│  │  │  ├─ booking.service.ts
│  │  │  ├─ booking.repository.ts
│  │  │  ├─ availability.algorithm.ts
│  │  │  └─ booking.validation.ts
│  │  ├─ restaurant/
│  │  │  ├─ table.service.ts
│  │  │  ├─ reservation.service.ts
│  │  │  └─ reservation.algorithm.ts
│  │  ├─ payments/
│  │  ├─ reviews/
│  │  ├─ gallery/
│  │  ├─ cms/
│  │  └─ notifications/ (email)
│  ├─ models/                         Mongoose schemas (one file per collection)
│  ├─ components/
│  │  ├─ ui/                          shadcn primitives
│  │  ├─ layout/                      Navbar, Footer, DashboardShell, AdminShell
│  │  ├─ home/                        Hero, About, FeaturedRooms, Amenities, ...
│  │  ├─ rooms/                       RoomCard, RoomFilters, RoomGallery, BookingWidget
│  │  ├─ restaurant/                  MenuCard, TableMap, ReservationForm
│  │  ├─ admin/                       DataTable, AnalyticsChart, forms
│  │  └─ shared/                      SectionHeading, AnimatedCounter, ImageWithFallback
│  ├─ lib/
│  │  ├─ db/connectMongo.ts
│  │  ├─ auth/{jwt.ts, session.ts, rbac.ts, password.ts}
│  │  ├─ cache/redis.ts
│  │  ├─ email/{client.ts, templates/*.tsx}
│  │  ├─ payments/razorpay.ts
│  │  ├─ storage/cloudinary.ts
│  │  ├─ validations/                 shared Zod schemas
│  │  ├─ utils/{dates.ts, pricing.ts, slugify.ts, pagination.ts}
│  │  └─ constants/{roomTypes.ts, tableTypes.ts, bookingStatus.ts}
│  ├─ hooks/                          useAvailability, useBookingDraft, ...
│  ├─ store/                          Zustand stores (search widget, admin UI, cart)
│  ├─ types/                          shared TS types/interfaces
│  ├─ emails/                         React Email templates
│  └─ middleware.ts
├─ scripts/seed.ts
├─ .env.example
├─ next.config.ts
├─ tailwind.config.ts
└─ package.json
```

---

## 3. Database Schema (overview — full Mongoose code ships in implementation phase)

### Collections & key relationships
```
User ──┬─< RoomBooking >── Room
       ├─< RestaurantReservation >── RestaurantTable
       ├─< Review >── (Room | Restaurant)
       ├─< Payment >── (RoomBooking | RestaurantReservation)
       └─< ContactQuery
Gallery, Amenity, WebsiteSettings — standalone reference/content collections
```

### 3.1 `User`
| field | type | notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase, indexed |
| phone | String | required, unique |
| passwordHash | String | required, select:false |
| role | enum(customer,staff,admin) | default customer |
| avatarUrl | String | Cloudinary |
| favorites | [ObjectId→Room] | |
| refreshTokenHash | String | select:false, rotated on use |
| isEmailVerified | Boolean | default false |
| passwordResetToken / passwordResetExpires | String/Date | select:false |
| timestamps | | createdAt, updatedAt |

Indexes: `{email:1}` unique, `{phone:1}` unique.

### 3.2 `Room`
| field | type | notes |
|---|---|---|
| name | String | required |
| slug | String | unique, indexed |
| roomNumber | String | unique |
| roomType | enum(deluxe,executive,family,premium_suite) | indexed |
| description | String | |
| capacity | {adults:Number, children:Number} | |
| pricePerNight | Number | required |
| discountPercent | Number | default 0 |
| images | [{url,publicId,alt}] | Cloudinary |
| amenities | [ObjectId→Amenity] | |
| size | Number | sq.ft, optional |
| floor | Number | |
| isActive | Boolean | default true — soft "out of service" switch, NOT used for availability math |
| ratingAvg / ratingCount | Number | denormalized from Review |
| timestamps | |

Indexes: `{roomType:1, isActive:1}`, `{slug:1}` unique, `{pricePerNight:1}`.
**Note:** `isActive=false` means "withdrawn from sale" (maintenance/renovation), separate from booking-based availability — see §9.

### 3.3 `RoomBooking`
| field | type | notes |
|---|---|---|
| bookingCode | String | unique, human-readable (e.g. NN-RB-240601-XXXX) |
| user | ObjectId→User | required, indexed |
| room | ObjectId→Room | required, indexed |
| checkIn / checkOut | Date | required, checkOut > checkIn |
| nights | Number | derived, stored for reporting |
| guests | {adults,children} | |
| guestDetails | {name,email,phone,idProofType?,idProofNumber?} | snapshot at booking time |
| ratePerNight | Number | snapshot — price changes don't affect existing bookings |
| totalAmount | Number | |
| status | enum(pending_payment,confirmed,cancelled,checked_in,checked_out,no_show) | indexed |
| payment | ObjectId→Payment | |
| cancellation | {reason, cancelledAt, refundAmount} | |
| specialRequests | String | |
| timestamps | |

Indexes:
- `{room:1, checkIn:1, checkOut:1}` — the core availability-lookup index.
- `{user:1, createdAt:-1}` — booking history.
- `{bookingCode:1}` unique.
- `{status:1, checkIn:1}` — admin dashboards/cron (auto-expire pending).

### 3.4 `RestaurantTable`
| field | type | notes |
|---|---|---|
| tableNumber | String | unique |
| tableType | enum(2_seater,4_seater,6_seater,family_table) | indexed |
| capacity | Number | |
| location | enum(indoor,outdoor,private) | |
| isActive | Boolean | default true |
| timestamps | |

### 3.5 `RestaurantReservation`
| field | type | notes |
|---|---|---|
| reservationCode | String | unique |
| user | ObjectId→User | indexed |
| table | ObjectId→RestaurantTable | nullable until allocated — see §10 |
| tableType | enum | requested type, used if table not yet assigned |
| date | Date (date-only, normalized to 00:00 UTC) | indexed |
| timeSlot | {start: "19:00", end: "20:30"} stored as minutes-from-midnight ints | indexed |
| partySize | Number | |
| guestDetails | {name,email,phone} | |
| status | enum(pending,confirmed,seated,completed,cancelled,no_show) | indexed |
| specialRequests | String | |
| timestamps | |

Indexes:
- `{table:1, date:1, "timeSlot.start":1}` partial unique on status∈{pending,confirmed,seated} — prevents duplicate reservation for same table/slot (see §10).
- `{date:1, tableType:1}`.
- `{user:1, createdAt:-1}`.

### 3.6 `Review`
| field | type |
|---|---|
| user | ObjectId→User |
| targetType | enum(room,restaurant,general) |
| targetId | ObjectId, refPath by targetType (nullable for general) |
| rating | Number 1–5 |
| title / comment | String |
| images | [{url,publicId}] |
| isApproved | Boolean default false — moderation gate before public display |
| reply | {text, repliedBy, repliedAt} — admin response |
| timestamps |

Index: `{targetType:1, targetId:1, isApproved:1}`, `{user:1, targetType:1, targetId:1}` unique (one review per booking-target per user).

### 3.7 `Gallery`
`{title, category(rooms|restaurant|exterior|events|amenities), imageUrl, publicId, isFeatured, order, timestamps}`. Index `{category:1, order:1}`.

### 3.8 `Amenity`
`{name, icon, description, category(room|hotel|restaurant), timestamps}`.

### 3.9 `Payment`
| field | type |
|---|---|
| user | ObjectId→User |
| purpose | enum(room_booking,restaurant_reservation) |
| referenceId | ObjectId (RoomBooking or RestaurantReservation) |
| razorpayOrderId / razorpayPaymentId / razorpaySignature | String |
| amount | Number (paise) |
| currency | default INR |
| status | enum(created,authorized,captured,failed,refunded,partially_refunded) |
| refunds | [{razorpayRefundId, amount, reason, createdAt}] |
| timestamps |

Index `{razorpayOrderId:1}` unique, `{user:1, createdAt:-1}`.

### 3.10 `ContactQuery`
`{name, email, phone, subject, message, status(new|in_progress|resolved), timestamps}`.

### 3.11 `WebsiteSettings`
Singleton document: `{hotelInfo, seo, socialLinks, businessHours, taxConfig:{gstPercent}, checkInTime, checkOutTime, cancellationPolicy, heroMedia, homepageSections[]}`. CMS-editable.

All schemas: `{ timestamps: true }`, Zod-mirrored validation at the API boundary (not just Mongoose validators), and `toJSON` transforms that strip `__v`/sensitive fields.

---

## 4. API Design (REST, under `/api`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | create account |
| POST | `/api/auth/login` | public | issue access+refresh cookies |
| POST | `/api/auth/logout` | session | clear cookies, invalidate refresh |
| POST | `/api/auth/refresh` | refresh cookie | rotate tokens |
| POST | `/api/auth/forgot-password` | public | email reset link |
| POST | `/api/auth/reset-password` | public + token | set new password |
| GET | `/api/rooms` | public | list + filters (type, dates, guests, price range, pagination) |
| GET | `/api/rooms/[slug]` | public | room detail |
| POST | `/api/rooms` | admin | create room |
| PATCH | `/api/rooms/[id]` | admin | update room |
| DELETE | `/api/rooms/[id]` | admin | soft delete (isActive=false) |
| GET | `/api/rooms/availability?checkIn&checkOut&guests&type` | public | available rooms (§9) |
| POST | `/api/bookings` | customer | create booking (pending_payment) |
| GET | `/api/bookings` | customer/admin | my bookings / all bookings (admin, filterable) |
| GET | `/api/bookings/[id]` | owner/admin | detail |
| POST | `/api/bookings/[id]/cancel` | owner/admin | cancel + trigger refund policy |
| GET | `/api/restaurant/tables` | admin | list tables |
| POST | `/api/restaurant/tables` | admin | create table |
| PATCH/DELETE | `/api/restaurant/tables/[id]` | admin | update/remove |
| GET | `/api/restaurant/availability?date&time&partySize` | public | available slots/types (§10) |
| POST | `/api/restaurant/reservations` | customer | create reservation |
| GET | `/api/restaurant/reservations` | customer/admin | history / all |
| POST | `/api/restaurant/reservations/[id]/cancel` | owner/admin | cancel |
| POST | `/api/payments/order` | customer | create Razorpay order for a booking/reservation |
| POST | `/api/payments/verify` | customer | verify signature, confirm booking |
| POST | `/api/payments/webhook` | razorpay (HMAC) | async capture/refund/failed events |
| GET | `/api/payments/history` | customer/admin | |
| GET | `/api/reviews` | public | approved reviews (filter by target) |
| POST | `/api/reviews` | customer | submit (requires completed booking/reservation) |
| PATCH | `/api/reviews/[id]/moderate` | admin | approve/reject/reply |
| GET/POST | `/api/gallery` | public / admin | |
| PATCH/DELETE | `/api/gallery/[id]` | admin | |
| GET/PATCH | `/api/cms/settings` | public(GET subset)/admin(full) | site content |
| GET | `/api/admin/analytics?range=` | admin | revenue, occupancy, RevPAR, top rooms, reservation funnel |
| POST | `/api/contact` | public | rate-limited |
| GET | `/api/uploads/cloudinary-sign` | admin/staff | signed upload params |

Conventions: cursor or page-based pagination on all list endpoints, `{ success, data, meta }` envelope, problem-style error body `{ success:false, error:{code,message,fields?} }`, every mutating route validates with the matching Zod schema before touching the DB.

---

## 5. Component Hierarchy (high-level)

```
RootLayout
├─ Navbar (transparent→solid on scroll, mega-menu, auth state aware)
├─ (marketing)/page.tsx
│  ├─ HeroSection (video bg, BookingWidget overlay)
│  ├─ AboutSection
│  ├─ FeaturedRoomsSection → RoomCard[]
│  ├─ AmenitiesSection → AmenityItem[]
│  ├─ RestaurantShowcaseSection
│  ├─ GalleryPreviewSection → MasonryGrid
│  ├─ TestimonialsSection → TestimonialCard[] (carousel, Framer Motion)
│  ├─ NearbyAttractionsSection
│  ├─ WhyChooseUsSection
│  └─ ContactCTASection
├─ rooms/page.tsx
│  ├─ RoomFilters (type, price, capacity, dates)
│  ├─ RoomGrid → RoomCard[]
│  └─ Pagination
├─ rooms/[slug]/page.tsx
│  ├─ RoomGallery (lightbox)
│  ├─ RoomInfo (amenities, capacity, description)
│  ├─ BookingWidget (sticky) → DateRangePicker, GuestSelector, AvailabilityBadge
│  └─ RelatedRooms
├─ restaurant/* — MenuCategoryTabs, MenuItemCard, ReservationWidget (date/time/party)
├─ DashboardShell (sidebar: Profile, Bookings, Reservations, Favorites, Reviews)
│  └─ DataTable (shared with admin, generic columns)
└─ AdminShell (sidebar nav, topbar with notifications)
   ├─ AnalyticsDashboard → KpiCard[], RevenueChart, OccupancyChart
   ├─ RoomManagement → RoomTable, RoomFormDialog
   ├─ BookingManagement → BookingTable, BookingDetailDrawer
   ├─ TableManagement / ReservationManagement
   ├─ GalleryManagement (drag-reorder, Cloudinary upload)
   ├─ ReviewModeration
   ├─ CustomerManagement
   ├─ CMSManagement (sections editor)
   └─ Settings
```

Shared primitives: `shadcn/ui` (Button, Dialog, Sheet, Form, Calendar, Select, Table, Tabs, Toast, Skeleton) wrapping into project-specific molecules (`PriceTag`, `StatusBadge`, `RatingStars`, `EmptyState`).

---

## 6. User Flows

**Browse → Book**
`Home → Rooms (filter by dates/guests) → Room Detail → BookingWidget validates dates → "Book Now" → (if logged out → Login/Register modal, return to draft) → Guest Details form → Create booking (status=pending_payment) → Razorpay Checkout → Verify → Confirmation page + email`

**Restaurant reservation**
`Restaurant page → Reservation widget (date, time, party size) → Availability check → pick table type/slot → Guest details → (optional prepayment for large parties, else confirm directly) → Confirmation + email`

**Auth**
`Register (email+phone+password) → email verification (non-blocking) → Login (JWT cookies) → Forgot Password (emailed token, 15-min expiry) → Reset Password`

**Dashboard self-service**
`Profile edit → Booking history (filter/cancel within policy window) → Reservation history (cancel) → Favorites (toggle from RoomCard, persisted to User.favorites) → Leave review (only for completed bookings/reservations)`

---

## 7. Admin Flows

`Login (admin role) → Analytics overview (date-range KPIs) → Rooms (CRUD, image upload, toggle isActive) → Bookings (search/filter by status/date, manual check-in/out, refund) → Restaurant Tables (CRUD) → Reservations (calendar/list view, manual allocate/override) → Gallery (upload, reorder, categorize) → Reviews (approve/reject/reply) → Customers (view profile, booking history, block) → CMS (edit homepage sections, hero media, policies) → Settings (tax %, cancellation policy, business hours, integration keys placeholder)`

Staff role: subset — Bookings, Reservations, Tables, Gallery (no Settings/CMS/Customer-block/financial refunds beyond a configurable limit).

---

## 8. Booking System Design

### 8.1 Statuses & state machine
**RoomBooking**: `pending_payment → confirmed → checked_in → checked_out` ; or `pending_payment → cancelled` ; or `confirmed → cancelled` ; or `confirmed → no_show` (auto, post check-in-date+grace if not checked in).
**RestaurantReservation**: `pending → confirmed → seated → completed` ; or `→ cancelled` ; or `confirmed → no_show`.

Transitions are enforced in the service layer via an explicit allow-list map — no ad-hoc status writes from controllers.

### 8.2 Preventing double booking — concurrency strategy
1. **Optimistic intent, pessimistic commit.** Availability is *checked* for UX (read-only, can use Redis-cached counts), but the authoritative check happens again at write time inside a transaction.
2. **Mongo multi-document transaction** wraps: re-check overlap → insert booking doc. Atlas (replica set) supports this natively.
3. **Short-lived hold**: on `createBooking`, the booking row is created immediately with `status=pending_payment` and an `expiresAt` (e.g. now+10min, TTL index). This *itself* occupies the date range in the overlap check, so a second user querying availability in that window sees the room as held. A cron / TTL index auto-expires abandoned holds, releasing the room.
4. **Redis distributed lock (optional, multi-instance only)**: `lock:room:{roomId}` held for the duration of the check-and-insert critical section to avoid two app instances racing inside the same millisecond before Mongo's transaction conflict shows up. Not required for a single-instance deployment since Mongo transactions already serialize conflicting writes (one will get a `WriteConflict` and is retried).
5. Retry wrapper: on transient transaction errors, retry up to 3× with jitter.

### 8.3 Pricing
`totalAmount = nights * ratePerNight * (1 - discountPercent/100) + taxes(gstPercent from WebsiteSettings)`, computed server-side and snapshotted onto the booking — never trusted from client.

### 8.4 Cancellation & refunds
Policy from `WebsiteSettings.cancellationPolicy` (e.g. free >72h before check-in, 50% 24–72h, 0% <24h). Refund amount computed server-side, Razorpay refund API called, `Payment.refunds[]` appended, booking → `cancelled`.

---

## 9. Room Availability Algorithm

**Premise (per task spec):** availability is *derived from booking records*, never a static boolean on the Room document. `Room.isActive` only governs whether a room is sellable at all (maintenance); it is independent of date-based occupancy.

### 9.1 Overlap rule
Two date ranges `[checkIn, checkOut)` overlap iff:
```
existing.checkIn < new.checkOut  AND  existing.checkOut > new.checkIn
```
(half-open intervals — a checkout on day N and a new check-in on day N do NOT overlap, enabling same-day turnover.)

A booking only blocks a room if its status ∈ `{pending_payment (not expired), confirmed, checked_in}`. `cancelled`, `no_show`, `checked_out`, and expired `pending_payment` do not block.

### 9.2 Single-room check (used inside the booking transaction)
```ts
async function isRoomAvailable(roomId, checkIn, checkOut, session) {
  const conflict = await RoomBooking.findOne({
    room: roomId,
    status: { $in: ['confirmed', 'checked_in'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  }).session(session);
  if (conflict) return false;

  const heldConflict = await RoomBooking.findOne({
    room: roomId,
    status: 'pending_payment',
    expiresAt: { $gt: new Date() },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  }).session(session);
  return !heldConflict;
}
```
Backed by index `{room:1, checkIn:1, checkOut:1}` (and `{status:1}` implicitly via query selectivity).

### 9.3 Search/listing check (many rooms, one date range) — used by `GET /api/rooms/availability`
Single aggregation, no N+1:
```ts
async function findAvailableRooms({ checkIn, checkOut, roomType, guests }) {
  const blockedRoomIds = await RoomBooking.distinct('room', {
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    $or: [
      { status: { $in: ['confirmed', 'checked_in'] } },
      { status: 'pending_payment', expiresAt: { $gt: new Date() } },
    ],
  });

  return Room.find({
    _id: { $nin: blockedRoomIds },
    isActive: true,
    ...(roomType && { roomType }),
    ...(guests && {
      'capacity.adults': { $gte: guests.adults },
      'capacity.children': { $gte: guests.children ?? 0 },
    }),
  })
    .sort({ pricePerNight: 1 })
    .lean();
}
```
This is O(bookings-in-conflict + rooms-matching-filters), with both queries index-served — scales fine for a single-property hotel (tens to low hundreds of rooms).

### 9.4 Race-safe create
```ts
async function createBooking(input) {
  return withTransaction(async (session) => {
    const available = await isRoomAvailable(input.roomId, input.checkIn, input.checkOut, session);
    if (!available) throw new ConflictError('ROOM_NOT_AVAILABLE');

    const booking = await RoomBooking.create([{
      ...input,
      status: 'pending_payment',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }], { session });

    return booking[0];
  }); // withTransaction retries on TransientTransactionError / WriteConflict
}
```
TTL index on `expiresAt` (partial: `status: 'pending_payment'`) lets MongoDB auto-delete abandoned holds, which is a cheap safety net in addition to the explicit `expiresAt` check above (belt-and-suspenders: the check is what matters for correctness; the TTL index just keeps the collection tidy).

---

## 10. Table Reservation Allocation Algorithm

### 10.1 Slot model
Time slots are generated server-side from `WebsiteSettings.businessHours` (e.g. restaurant open 12:00–23:00) sliced into a configurable seating duration (default **90 minutes**) plus a **15-minute buffer** for turnover, stored as integer minutes-from-midnight for cheap comparisons. A reservation occupies `[start, start+90)`; the buffer means the *next* reservation on that table can't start before `start+90+15`.

### 10.2 Overlap rule (per table)
Same half-open-interval logic as rooms, but on minutes-of-day plus buffer:
```
existing.start < new.start + duration + buffer  AND
existing.start + duration + buffer > new.start
```
Equivalently, simplify by always treating a reservation's *blocked window* as `[start, start + duration + buffer)` and checking standard interval overlap against the new request's `[start, start+duration)`.

### 10.3 Allocation: best-fit, not first-fit
Goal: don't seat a 2-top at a family table if a 2-seater is free. Given `(date, time, partySize)`:

1. Map `partySize` → minimum sufficient `tableType` order: `2_seater(≤2) < 4_seater(≤4) < 6_seater(≤6) < family_table(>6)`.
2. Query candidate tables of the *smallest sufficient type first*; if none free, escalate to the next size up (better to slightly oversize than reject a guest).
3. Within a type, prefer the table with the **fewest other reservations that day** (load balancing) — tiebreak by `tableNumber`.

```ts
const TABLE_RANK = ['2_seater', '4_seater', '6_seater', 'family_table'];
const MIN_TYPE_FOR_SIZE = (n) =>
  n <= 2 ? '2_seater' : n <= 4 ? '4_seater' : n <= 6 ? '6_seater' : 'family_table';

async function allocateTable({ date, start, duration, partySize, session }) {
  const blockedWindow = { start, end: start + duration + BUFFER_MIN };
  const candidateTypesInOrder = TABLE_RANK.slice(TABLE_RANK.indexOf(MIN_TYPE_FOR_SIZE(partySize)));

  for (const tableType of candidateTypesInOrder) {
    const tables = await RestaurantTable.find({ tableType, isActive: true }).session(session);
    if (!tables.length) continue;

    const busyTableIds = await RestaurantReservation.distinct('table', {
      date,
      status: { $in: ['pending', 'confirmed', 'seated'] },
      'timeSlot.start': { $lt: blockedWindow.end },
      // blocked window end stored or computed; see §10.4 on denormalizing blockedEnd
      blockedEnd: { $gt: blockedWindow.start },
    }).session(session);

    const free = tables.filter(t => !busyTableIds.some(id => id.equals(t._id)));
    if (free.length) {
      // load-balance: fewest reservations today, stable tie-break on tableNumber
      const counts = await Promise.all(free.map(t =>
        RestaurantReservation.countDocuments({ table: t._id, date }).session(session)
      ));
      const best = free
        .map((t, i) => ({ t, count: counts[i] }))
        .sort((a, b) => a.count - b.count || a.t.tableNumber.localeCompare(b.t.tableNumber))[0];
      return best.t;
    }
  }
  return null; // fully booked for that slot across all sufficient table types
}
```

### 10.4 Schema support
`RestaurantReservation.blockedEnd` (= `timeSlot.start + duration + buffer`, computed pre-save) is denormalized specifically so the overlap query is a single indexed range comparison instead of recomputing buffers per-document at query time. Index: `{table:1, date:1, blockedEnd:1, "timeSlot.start":1}`.

### 10.5 Race-safe create + duplicate prevention
```ts
async function createReservation(input) {
  return withTransaction(async (session) => {
    const table = input.tableId
      ? await assertSpecificTableFree(input.tableId, input.date, input.start, session)
      : await allocateTable({ ...input, session });
    if (!table) throw new ConflictError('NO_TABLE_AVAILABLE');

    return RestaurantReservation.create([{
      ...input,
      table: table._id,
      status: 'pending',
      blockedEnd: input.start + SEATING_DURATION_MIN + BUFFER_MIN,
    }], { session });
  });
}
```
A **partial unique index** `{ table: 1, date: 1, "timeSlot.start": 1 }` filtered to `status: { $in: ['pending','confirmed','seated'] }` gives a hard DB-level guarantee against duplicate reservations for the exact same table+slot even if application logic is somehow bypassed — defense in depth on top of the transactional check.

### 10.6 Availability response for the widget
`GET /api/restaurant/availability?date&partySize` returns, per generated slot, a boolean "has at least one sufficient table free" — computed by running §10.3's query in read-only mode (no transaction) across all slots of the day, cacheable in Redis for ~30s since it's a hot, low-stakes read (final correctness is re-verified at create time regardless).

---

## Open points for your approval

1. **Single hotel, single property** — schema above assumes one property. Confirm (vs. multi-property from day one, which would add a `Property` collection).
2. **Redis** — proposed as optional, added only if you deploy >1 app instance. OK to skip for v1 and rely on Mongo transactions?
3. **Seating duration/buffer (90 min + 15 min)** — placeholder, confirm or give your real policy.
4. **Cancellation policy thresholds** (free >72h / 50% 24–72h / 0% <24h) — placeholder, confirm or adjust.
5. **Phasing** — this is a large build. Suggested phases:
   - Phase 1: Auth, Rooms (CRUD+public), Room availability + booking + Razorpay + emails (core revenue path)
   - Phase 2: Restaurant module (tables/reservations) end-to-end
   - Phase 3: Reviews, Gallery, CMS, full Admin analytics
   - Phase 4: Polish — animations, SEO, performance pass
   Confirm this order, or specify a different priority.
