# Corchet Art — Website Development Plan

**Type:** Handmade crochet e-commerce showcase site (no online payments)
**Goal:** Showcase work, collect orders via a custom-order form + WhatsApp, manage orders through an admin panel, let customers track order status.
**Budget:** $0 (fully free stack, with an optional future paid custom domain)

---

## 1. Project Summary

Corchet Art sells fully custom, made-to-order crochet items. There is no fixed product catalog with "buy now" buttons — customers describe what they want via a custom order form, which sends the request to the business owner over WhatsApp. Payment is arranged manually (bank transfer / JazzCash / Easypaisa) after the owner confirms the order. Once payment is confirmed, the owner marks the order as active in an admin panel, and the customer can track its status using a unique order ID.

### Core principles
- No payment gateway integration required.
- No fixed inventory/catalog system — orders are custom requests, not cart purchases.
- Admin panel is the operational hub: every order lives here.
- Site must work well on mobile, since most traffic will come from Pakistani mobile users clicking through to WhatsApp.

---

## 2. Brand & Design

| Item | Value |
|---|---|
| Brand name | Corchet Art |
| Logo | None yet — placeholder text logo (styled brand name) until a real logo is made |
| Color palette | **Terracotta & Cream** |
| Primary | Terracotta / rust — e.g. `#C1663B` |
| Secondary | Deep brown (text) — e.g. `#4A3226` |
| Background | Cream / off-white — e.g. `#FAF3EA` |
| Accent | Soft warm tan — e.g. `#E8C9A6` |
| Typography | Warm, handcrafted feel: a serif or soft display font for headings (e.g. Fraunces, Playfair Display), clean sans-serif for body text (e.g. Inter, Nunito) |
| Tone | Warm, cozy, artisanal, handmade — not corporate or minimal-cold |
| Delivery area | All of Pakistan |
| Social links | To be added later — leave placeholder icons/links in footer, disabled or hidden until provided |
| About Us copy | To be added later — leave a placeholder section on the About page |

---

## 3. Site Structure (Pages)

### 3.1 Home
- Hero section: brand name, short tagline, background/hero image of crochet work, CTA button → "Start a Custom Order"
- Short intro blurb (placeholder until About Us copy is provided)
- Featured gallery preview (3–6 images pulled from the Gallery)
- Reviews preview strip (2–3 placeholder review cards)
- Footer: contact/WhatsApp button, social icons (hidden/disabled until links provided), delivery note ("Delivering across Pakistan")

### 3.2 Gallery / Portfolio
- Grid of past/example work, grouped by category (e.g. toys/amigurumi, bags, blankets, clothing, accessories) — purely for inspiration, not "add to cart"
- Each image can open a lightbox/modal with a larger view
- Optional filter by category
- CTA at bottom: "Like something similar? Start a custom order"

### 3.3 Custom Order (core feature)
A form the customer fills out to describe what they want. Fields:
- Full name
- Phone number
- City
- Project type (dropdown: Amigurumi/Toy, Bag, Blanket, Clothing, Accessory, Other)
- Description of what they want (free text)
- Preferred colors (free text or color swatch picker)
- Size/dimensions (free text)
- Reference image upload (optional — customer can upload a photo of what they want)
- Budget range (optional dropdown)
- Needed-by date (optional)

On submit:
1. Save the order to the database with status `Pending`, and generate a unique **Order ID**.
2. Show the customer their Order ID on-screen (and tell them to save it for tracking).
3. Generate a prefilled WhatsApp message (via a `wa.me` link) summarizing the order details + Order ID, and open it in a new tab/redirect the customer to WhatsApp to confirm with the owner.
4. If a reference image was uploaded, include a note in the WhatsApp message that a reference photo was attached (image itself is stored on the backend, viewable in the admin panel — WhatsApp text links can't carry images directly, so the admin should also glance at the panel entry).

### 3.4 Reviews
- Grid/list of review cards: customer photo (or placeholder avatar), star rating (1–5), short review text, customer name
- **For now: use placeholder/sample reviews** (clearly nice-looking but generic) — structured so real reviews can be swapped in later without redesign
- Optional: "Leave a review" note/link pointing to WhatsApp or social media (not a public review submission form, to avoid spam)

### 3.5 Track Order
- Single input field: "Enter your Order ID"
- On submit, look up the order and display:
  - Order ID
  - Project type / short description
  - Current status (see status flow below)
  - Last updated date
- If ID not found, show a friendly "Order not found — check your ID or contact us on WhatsApp" message with a WhatsApp button

### 3.6 About Us
- Placeholder section for the brand story (to be filled in later)
- Basic info: handmade, custom, made in Pakistan, delivers nationwide

### 3.7 Contact
- WhatsApp button (primary contact method)
- Social media icons (placeholder/hidden until links are provided)
- Optional simple contact form (name, message) as a backup, using a free form service (not a database order — just an email forward)

### 3.8 Admin Panel (password-protected, not publicly linked)
- Login page (owner-only credentials)
- Orders dashboard: table/list of all orders with columns — Order ID, Customer Name, Phone, Project Type, Date Submitted, Status, Payment Status
- Click into an order to view full details (description, reference image, size, budget, etc.)
- Ability to update:
  - **Order status**: Pending → Confirmed → In Progress → Ready → Delivered (owner can also mark **Cancelled**)
  - **Payment status**: Unpaid → Paid (manual toggle, since payment happens outside the site)
- Search/filter orders by status or customer name
- (Optional, later phase) Simple stats: total orders, orders by status, orders this month

---

## 4. Order Status Flow

```
Pending → Confirmed → In Progress → Ready → Delivered
                  \
                   → Cancelled (can branch off at any stage)
```

- **Pending**: Order form submitted, not yet confirmed via WhatsApp/payment.
- **Confirmed**: Customer has messaged on WhatsApp and payment has been received (owner marks Payment Status = Paid, and moves order to Confirmed).
- **In Progress**: Owner has started making the item.
- **Ready**: Item is finished, awaiting delivery/pickup.
- **Delivered**: Order complete.
- **Cancelled**: Order dropped, at any stage.

Customers only see the **status name** on the Track Order page — no internal notes.

---

## 5. Technical Stack (Fully Free)

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | **Next.js** (React) | Free, deploys cleanly to Vercel, good SEO for a public storefront |
| Hosting | **Vercel** (free tier) | Auto-deploy from GitHub, free HTTPS + CDN |
| Domain | Start with free `corchetart.vercel.app` subdomain | A real `.com`/`.pk` domain is a future paid step (~$8–15/yr) — not free anywhere legitimate; avoid "free domain" offers, they're usually low-quality or time-limited |
| Database | **Supabase** (free tier, Postgres) | Stores orders, reviews, admin auth. Free tier is enough for a small handmade business |
| Auth (admin login) | **Supabase Auth** | Simple email/password login restricted to the owner |
| Image storage | **Supabase Storage** or **Cloudinary** (free tier) | For gallery photos and customer-uploaded reference images |
| Forms | Native Next.js form → Supabase insert | No third-party form service needed for the order form itself |
| Contact form (optional) | **Web3Forms** or **Formspree** free tier | Only if a non-WhatsApp contact form is added |
| WhatsApp integration | `wa.me` links (`https://wa.me/<number>?text=<url-encoded message>`) | No WhatsApp Business API needed — this is free and requires no approval |
| Version control | **GitHub** (free) | Connects to Vercel for auto-deploy |

**No cost at any point in this stack** unless: (a) you later buy a custom domain, or (b) traffic/storage grows well beyond a small handmade business's needs (unlikely for a long time on free tiers).

---

## 6. Database Schema (Supabase / Postgres)

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | internal ID |
| order_id | text (unique) | short human-friendly ID shown to customer, e.g. `CA-1024` |
| customer_name | text | |
| phone | text | |
| city | text | |
| project_type | text | enum-like: Amigurumi, Bag, Blanket, Clothing, Accessory, Other |
| description | text | |
| preferred_colors | text | |
| size | text | |
| reference_image_url | text (nullable) | |
| budget_range | text (nullable) | |
| needed_by | date (nullable) | |
| status | text | Pending / Confirmed / In Progress / Ready / Delivered / Cancelled |
| payment_status | text | Unpaid / Paid |
| created_at | timestamp | |
| updated_at | timestamp | |

### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| customer_name | text | |
| rating | int (1–5) | |
| review_text | text | |
| photo_url | text (nullable) | |
| is_placeholder | boolean | true for launch placeholders, false for real reviews |
| created_at | timestamp | |

### `gallery`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| image_url | text | |
| category | text | Amigurumi, Bag, Blanket, Clothing, Accessory, Other |
| caption | text (nullable) | |

---

## 7. WhatsApp Message Template

Generated automatically from the Custom Order form and opened via a `wa.me` link:

```
Hi Corchet Art! I'd like to place a custom order.

Order ID: CA-1024
Name: [customer_name]
Project Type: [project_type]
Description: [description]
Preferred Colors: [preferred_colors]
Size: [size]
Budget: [budget_range]
Needed by: [needed_by]

(Reference photo was uploaded on the site — please check the admin panel.)
```

WhatsApp link format:
`https://wa.me/<COUNTRY_CODE_AND_NUMBER>?text=<URL-encoded message above>`

---

## 8. Build Phases (suggested order)

1. **Setup**: Next.js project, GitHub repo, Vercel deployment, Supabase project + schema above.
2. **Static pages**: Home, Gallery (with placeholder images), About, Contact — lock in the Terracotta & Cream design system (colors, fonts, spacing) here first.
3. **Reviews section**: build with placeholder review data.
4. **Custom Order form**: build form → Supabase insert → Order ID generation → WhatsApp redirect.
5. **Track Order page**: Order ID lookup → status display.
6. **Admin panel**: login, orders table, order detail view, status/payment update controls.
7. **Polish**: mobile responsiveness pass, loading states, empty states (e.g. "no orders yet"), error handling (e.g. invalid Order ID).
8. **Launch**: deploy on `*.vercel.app`, test full flow end-to-end (submit order → WhatsApp → admin update → customer tracks status).
9. **Later**: real About Us copy, real reviews, social media links, logo, custom domain.

---

## 9. Open Items (to fill in before/during build)

- [ ] WhatsApp business number (with country code)
- [ ] About Us story/copy
- [ ] Real logo (or confirm placeholder text-logo is fine for launch)
- [ ] Social media links
- [ ] Sample gallery photos to launch with
- [ ] Admin login credentials (owner email/password for Supabase Auth)
- [ ] Decide whether payment account details (bank/JazzCash/Easypaisa) are shown on-site or only shared privately over WhatsApp after order confirmation
