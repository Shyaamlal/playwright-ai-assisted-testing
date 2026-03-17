# ConfirmationPage Locator Review
**Date:** 2026-03-17
**Page:** `/checkout-complete.html`
**Purpose:** Confirm the order was placed successfully. End of the checkout journey.

---

## Section 1 — Human Inspection (Shyaamlal)

| data-test | Element | Notes |
|---|---|---|
| `back-to-products` | Back Home button | Returns to products page |
| `pony-express` | Circular checkmark image | Confirmation visual indicator |
| `complete-header` | "Thank you for your order!" | Bold heading |
| `complete-text` | Dispatch confirmation text | Second line below heading |

---

## Section 2 — AI Inspection (Claude via Playwright scrape)

Logged in as `standard_user`, added Bike Light to cart, completed full checkout flow, arrived at `/checkout-complete.html`. Scraped all `data-test` attributes.

**Full list found:**

| data-test | tag | Scope |
|---|---|---|
| `header-container` | div | Out of scope (global) |
| `primary-header` | div | Out of scope (global) |
| `open-menu` | img | Out of scope (global) |
| `inventory-sidebar-link` | a | Out of scope (global) |
| `about-sidebar-link` | a | Out of scope (global) |
| `logout-sidebar-link` | a | Out of scope (global) |
| `reset-sidebar-link` | a | Out of scope (global) |
| `close-menu` | img | Out of scope (global) |
| `shopping-cart-link` | a | Out of scope — present but empty (no badge). Cart cleared after order. |
| `secondary-header` | div | Out of scope (structural) |
| `title` | span | Out of scope (display only) |
| `checkout-complete-container` | div | Out of scope (structural wrapper) |
| `pony-express` | img | **In scope** |
| `complete-header` | h2 | **In scope** |
| `complete-text` | div | **In scope** |
| `back-to-products` | button | **In scope** |
| `footer` | footer | Out of scope |
| `social-twitter/facebook/linkedin` | a | Out of scope |
| `footer-copy` | div | Out of scope |

**What AI found that human missed:**
- Cart badge (`shopping-cart-badge`) is absent — cart is empty after order completion. Meaningful state worth asserting in the E2E test.

**What human found that AI missed:**
- Nothing — human inspection was complete. All four data-test guesses were correct.

---

## Section 3 — Agreed Locators (In Scope for ConfirmationPage)

| data-test | Type | Method/Property | Notes |
|---|---|---|---|
| `back-to-products` | button | `backHomeButton` (Locator) | Return to products after order |
| `pony-express` | img | `confirmationImage` (Locator) | Assert success visual is shown |
| `complete-header` | h2 | `successHeader` (Locator) | Assert "Thank you for your order!" |
| `complete-text` | div | `successText` (Locator) | Assert dispatch confirmation text |

---

## Section 4 — Q&A

**Q: Does anything change on this page based on what was ordered?**

No. The page is static — same image, same text, same button regardless of what was in the cart. The only variable is the cart badge being absent (cleared). This is a terminal page in the flow.

---

## Key Learnings from This Session

### Simplest page, fewest locators — that's correct
The confirmation page has four in-scope elements. Resisting the urge to add more (like the structural container) is the right call. Page objects should only have what tests need.

### Human guessed locators correctly from DevTools
All four `data-test` values were identified during human inspection without needing the AI scrape to correct them. This is the expected outcome as familiarity with SauceDemo's naming patterns grows.

### Cart badge absent = meaningful state
After `finish`, the cart badge disappears. The E2E test should assert `cartBadge` is not visible on the confirmation page — this confirms the order cleared the cart, not just that the page loaded.

---

## Deferred Decisions

| Decision | Trigger |
|---|---|
| Assert cart badge absent | When writing the E2E test |
