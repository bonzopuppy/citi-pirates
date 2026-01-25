# Citi Pirates 12U Baseball Team Website
## Product Requirements Document

---

### Overview

A clean, modern website for the Citi Pirates 12U travel baseball team (San Francisco, CA) to support their fundraising efforts for the Cooperstown Tournament, showcase player profiles and stats, display corporate sponsors, and share team photos.

**Team Colors:** Red and Black

---

### Goals

1. Raise $35,000 for the Cooperstown Tournament (Summer 2026)
2. Celebrate each player with photos, bios, and stats
3. Recognize corporate sponsors
4. Share team memories through a photo gallery
5. Create a fan-friendly, professional look that lets the players shine

---

### Site Structure

```
Home
├── Fundraising (with progress tracker)
├── Roster (14 player cards → individual player pages)
├── Sponsors (logo grid)
└── Gallery (photo grid from Google Photos)
```

---

### Page Requirements

#### 1. Home Page

**Purpose:** Welcome visitors, set the tone, and provide quick navigation.

**Content:**
- Hero section with team photo and headline (e.g., "Road to Cooperstown 2026")
- Brief intro paragraph about the team and their goal
- Fundraising progress bar (mini version)
- Quick links to Donate, Roster, Sponsors, Gallery
- Team logo prominently displayed

---

#### 2. Fundraising Page

**Purpose:** Drive donations and show progress toward the $35,000 goal.

**Content:**
- Large visual progress tracker (thermometer or progress bar style)
- Current amount raised vs. goal
- "Donate" button (payment integration TBD - options: Stripe, PayPal, or GoFundMe embed)
- Brief story about Cooperstown trip and what it means to the team
- Optional: Recent donor recognition (e.g., "Thanks to the Smith Family!")

**Donation Tracking Requirements:**
- Capture donor name
- Capture donor email
- Capture donation amount
- Store for thank-you notes and tax receipt purposes
- Admin access to export donor list

**Future Decision Needed:** Payment processor selection
- **Option A:** Stripe (most professional, ~2.9% + $0.30 per transaction)
- **Option B:** PayPal (familiar to donors, similar fees)
- **Option C:** GoFundMe embed (easiest setup, higher fees ~2.9% + $0.30 + optional tip)
- **Option D:** Venmo/Zelle with manual tracking (no fees, more manual work)

---

#### 3. Roster Page

**Purpose:** Showcase all 14 players with a visual, card-based layout.

**Layout:** Grid of player cards (photos are the star)

**Each Player Card Shows:**
- Player photo (large, prominent)
- Name
- Jersey number
- Position

**Click Action:** Opens individual player detail page

---

#### 4. Individual Player Page

**Purpose:** Deep dive into each player.

**Content:**
- Large player photo
- Name and jersey number
- Position
- Fun fact
- Walk-up song (with Spotify/Apple Music link if desired)
- Season stats table

**Stats Display:**
- Updated weekly via manual entry (sourced from GameChanger screenshots)
- Key batting stats: AVG, OBP, SLG, HR, RBI, Runs, Stolen Bases
- Key pitching stats (if applicable): ERA, IP, K, BB, Wins

**Data Management:**
- Stats stored in a simple JSON or spreadsheet format
- David (or designated admin) updates weekly

---

#### 5. Sponsors Page

**Purpose:** Recognize and thank corporate sponsors.

**Layout:** Clean logo grid

**Content:**
- Sponsor logos (linked to their websites)
- Brief "Thank You to Our Sponsors" message
- Optional: "Become a Sponsor" contact link (email or form)

**No tiers** - all sponsors displayed equally

---

#### 6. Gallery Page

**Purpose:** Share team photos and memories.

**Integration:** Google Photos album embed or pull

**Layout:** 
- Responsive photo grid
- Lightbox view on click (full-size photo viewing)

**Content Management:**
- Photos managed in Google Photos
- Website pulls from shared album link
- Alternative: Direct upload to site repository

---

### Design Guidelines

**Overall Aesthetic:**
- Clean, modern, minimal
- Fan-friendly and approachable
- Let player photos be the heroes
- Professional but fun (this is 12-year-old baseball!)

**Color Palette:**
- Primary: Red (#CC0000 or similar)
- Secondary: Black (#1A1A1A)
- Accent: White (#FFFFFF)
- Background: Light gray or white

**Typography:**
- Bold, sporty headers (e.g., Oswald, Bebas Neue, or similar)
- Clean body text (e.g., Inter, Open Sans)

**Imagery:**
- Player photos should be high quality and consistently styled if possible
- Team logo in header/footer

**Responsive Design:**
- Must work well on mobile (parents will share links!)
- Desktop, tablet, and mobile breakpoints

---

### Technical Approach (Recommended)

**Framework:** Next.js or simple HTML/CSS/JS static site
- Static site is simpler for David to maintain
- Can host free on Vercel, Netlify, or GitHub Pages

**Data Storage:**
- Player info and stats: JSON files in repo (easy to edit)
- Donor info: Depends on payment processor choice

**Hosting:** Vercel or Netlify (free tier)

**Domain:** TBD (suggestions: citipiratesbaseball.com, citipirates12u.com)

---

### Content Needed from David

| Item | Status |
|------|--------|
| Team logo (PNG, SVG preferred) | ⬜ Needed |
| Team photo for hero | ⬜ Needed |
| 14 player headshots | ⬜ Needed |
| Player info (name, number, position, fun fact, walk-up song) | ⬜ Needed |
| Initial stats (or first GameChanger screenshot) | ⬜ Needed |
| Sponsor logos | ⬜ Needed |
| Google Photos album link | ⬜ Needed |
| Cooperstown trip description (2-3 sentences) | ⬜ Needed |
| Payment processor decision | ⬜ Needed |

---

### Open Questions

1. **Payment processor** - Which option works best for the team?
2. **Domain name** - Final decision on URL
3. **Who else needs admin access?** - Just David, or other parents/coaches?
4. **Tax receipts** - Does the team have 501(c)(3) status, or is this a personal fundraiser?

---

### Success Metrics

- Reach $35,000 fundraising goal
- All 14 players featured with photos and stats
- Site loads fast and looks great on mobile
- Easy for David to update weekly

---

### Timeline

| Phase | Description | Target |
|-------|-------------|--------|
| 1 | Design approval + content collection | Week 1 |
| 2 | Build core pages (Home, Roster, Gallery) | Week 2 |
| 3 | Fundraising integration + Sponsors | Week 3 |
| 4 | Testing + Polish | Week 4 |
| 5 | Launch! | ASAP |

---

*Document Version: 1.0*
*Last Updated: January 2026*
