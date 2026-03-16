# CheckoutInfoPage Locator Review
**Date:** 2026-03-16
**Page:** `/checkout-step-one.html`
**Purpose:** Collect first name, last name, and postal code before proceeding to order summary

---

## Section 1 — Human Inspection (Shyaamlal)

| data-test | Element | Notes |
|---|---|---|
| `firstName` | First name input | ✓ |
| `lastName` | Last name input | ✓ |
| `postalCode` | Zip/Postal code input | ✓ |
| `continue` | Continue button | ✓ |
| `cancel` | Cancel button | ✓ |
| `error` | Error message | ✓ — same data-test for all validation errors, text changes per scenario |

---

## Section 2 — AI Inspection (Claude via Playwright scrape)

Logged in as `standard_user`, added Bike Light to cart, navigated to `/checkout-step-one.html`. Scraped all `data-test` attributes, then triggered validation error by submitting empty form.

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
| `shopping-cart-link` | a | Out of scope (already in ProductsPage) |
| `shopping-cart-badge` | span | Out of scope (already in ProductsPage) |
| `secondary-header` | div | Out of scope (structural) |
| `title` | span | Out of scope (display only — no assertion needed yet) |
| `checkout-info-container` | div | Out of scope (structural wrapper) |
| `firstName` | input | **In scope** |
| `lastName` | input | **In scope** |
| `postalCode` | input | **In scope** |
| `cancel` | button | **In scope** |
| `continue` | input | **In scope** — note: `<input type="submit">`, not `<button>` |
| `error` | h3 | **In scope** — validation error message, inside `.error-message-container` |
| `error-button` | button | **In scope** — X dismiss button inside error message |
| `footer` | footer | Out of scope |
| `social-twitter/facebook/linkedin` | a | Out of scope |
| `footer-copy` | div | Out of scope |

**What AI found that human missed:**
- `error-button` — dismiss (X) button inside the error message. Lets user close the error without clearing the form.
- `continue` is an `<input type="submit">`, not a `<button>` — same behaviour but different tag

**What human found that AI missed:**
- Nothing — human inspection was complete

---

## Section 3 — Agreed Locators (In Scope for CheckoutInfoPage)

| data-test | Type | Method/Property | Notes |
|---|---|---|---|
| `firstName` | input | `firstNameInput` (Locator) | Fill with customer first name |
| `lastName` | input | `lastNameInput` (Locator) | Fill with customer last name |
| `postalCode` | input | `postalCodeInput` (Locator) | Fill with zip/postal code |
| `continue` | input[submit] | `continueButton` (Locator) | Proceed to order summary |
| `cancel` | button | `cancelButton` (Locator) | Go back to cart |
| `error` | h3 | `errorMessage` (Locator) | Assert validation error text |
| `error-button` | button | `dismissError()` method | Dismiss error — deferred until test needs it |

**Deferred:**
- `title` — if a test needs to assert page title "Checkout: Your Information"
- `error-button` dismiss — add `dismissError()` when a test needs to clear the error and retry

---

## Section 4 — Q&A

**Q: The `data-test` value is the same (`error`) for all validation errors — first name required, last name required, postal code required. Is that correct?**

Yes. SauceDemo shows one error at a time. Submit empty → "Error: First Name is required." Fill first name, submit again → "Error: Last Name is required." The element is always `data-test="error"` — the text changes per scenario. In tests, use the same locator (`errorMessage`) and assert different text values per scenario:
```typescript
await expect(checkoutInfoPage.errorMessage).toHaveText('Error: First Name is required')
```

---

**Q: Should the page object think about error messages? Should I find all combinations when building it?**

No to combinations — that's test logic, not page object responsibility. The page object needs one locator (`errorMessage`) that points to where the error lives. The *tests* decide which error scenario to cover and what text to assert. Separation of concerns:
- Page object = "where is the error element?"
- Tests = "what does it say in each case?"

Building all error combinations into the page object would be over-engineering. Add `errorMessage` as a locator, and let the test layer handle the scenarios.

---

## Key Learnings from This Session

### `continue` is an `<input>`, not a `<button>`
`data-test="continue"` is an `<input type="submit">` element. Playwright's `getByTestId('continue')` works identically — but worth knowing for when you read the HTML and wonder why it's not a `<button>`.

### Error element is dynamic — only appears after failed submission
`data-test="error"` is not present in the initial DOM scan. It only appears after clicking Continue with missing fields. Always verify error elements by triggering the error state, not just inspecting the initial page.

### One error at a time — same locator, different text
SauceDemo validates fields in order (first name → last name → postal code) and shows one message at a time. Test each scenario as a separate test with `toHaveText()` asserting the specific message.

### UX lens vs edge case lens
Noted during this session: testing from a UX perspective catches friction in the happy path. Edge case thinking is different — adversarial, boundary-focused. Bridge question: "what would a confused user type?" (UX) vs "what would a careless or malicious user type?" (edge case).

---

## Deferred Decisions

| Decision | Trigger |
|---|---|
| `dismissError()` method | When a test needs to close the error and retry filling the form |
| Global elements (header, sidebar) | When duplication appears across 2+ page objects |
