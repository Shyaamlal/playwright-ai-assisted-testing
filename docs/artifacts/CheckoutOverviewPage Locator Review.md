# CheckoutOverviewPage Locator Review
**Date:** 2026-03-17
**Page:** `/checkout-step-two.html`
**Purpose:** Review order summary before confirming — items, payment info, shipping info, price total

---

## Section 1 — Human Inspection (Shyaamlal)

| data-test | Element | Notes |
|---|---|---|
| `cancel` | Cancel button | Goes back to checkout info page |
| `finish` | Finish button | Proceeds to confirmation |
| `inventory-item-name` | Title link text | Navigates to product detail page |
| `inventory-item-desc` | Item description | Display only |
| `inventory-item-price` | Item price | Display only |
| `item-quantity` | Quantity per item | Display only |
| `payment-info-label` | "Payment Information:" label | Display only |
| `payment-info-value` | SauceCard dummy value | Display only |
| `shipping-info-label` | "Shipping Information:" label | Display only |
| `shipping-info-value` | Dummy shipping value | Display only |
| `total-info-label` | "Price Total" label | Display only |
| `subtotal-label` | Item total line | Display only |
| `tax-label` | Tax line | Display only |
| `total-label` | Total line | Display only |

**Questions raised:**
1. Is there a remove button on this page?
2. How do we abstract for multiple products — if `inventory-item-name` is the same across items, how do we differentiate?
3. When noting a label element — do we assert the exact text, or just that the element exists?
4. How do we test the math — subtotal + tax = total?

---

## Section 2 — AI Inspection (Claude via Playwright scrape)

Logged in as `standard_user`, added Bike Light to cart, navigated through checkout info, arrived at `/checkout-step-two.html`. Scraped all `data-test` attributes.

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
| `checkout-summary-container` | div | Out of scope (structural wrapper) |
| `cart-list` | div | Out of scope (structural wrapper — no current test needs it) |
| `cart-quantity-label` | div | Out of scope (column header) |
| `cart-desc-label` | div | Out of scope (column header) |
| `inventory-item` | div | Out of scope (structural per-item wrapper) |
| `item-quantity` | div | **In scope** |
| `item-0-title-link` | a | **In scope** — actual link element on item name (NOT `inventory-item-name`) |
| `inventory-item-name` | div | Out of scope — display div, not the link. Use `item-0-title-link` instead |
| `inventory-item-desc` | div | Out of scope (display only, no current test needs it) |
| `inventory-item-price` | div | **In scope** |
| `payment-info-label` | div | Out of scope (static label) |
| `payment-info-value` | div | **In scope** |
| `shipping-info-label` | div | Out of scope (static label) |
| `shipping-info-value` | div | **In scope** |
| `total-info-label` | div | Out of scope (static label) |
| `subtotal-label` | div | **In scope** |
| `tax-label` | div | **In scope** |
| `total-label` | div | **In scope** |
| `cancel` | button | **In scope** |
| `finish` | button | **In scope** |
| `footer` | footer | Out of scope |
| `social-twitter/facebook/linkedin` | a | Out of scope |
| `footer-copy` | div | Out of scope |

**What AI found that human missed:**
- `item-0-title-link` — the actual `<a>` link on the item title. `inventory-item-name` is a `div` containing the display text — not the link. Same distinction as CartPage.
- `cart-list` — structural wrapper, useful for asserting cart is not empty
- No `remove-{slug}` button exists on this page — confirmed. The overview page is read-only for cart items.

**What human found that AI missed:**
- Nothing — human inspection was complete

---

## Section 3 — Agreed Locators (In Scope for CheckoutOverviewPage)

| data-test | Type | Method/Property | Notes |
|---|---|---|---|
| `finish` | button | `finish` (Locator) | Primary action — complete the order |
| `cancel` | button | `cancel` (Locator) | Go back to checkout info |
| `item-0-title-link` | a | `getItemTitleLink(index)` method | Dynamic — takes index param |
| `inventory-item-price` | div | `itemPrice` (Locator) | Price per item |
| `item-quantity` | div | `itemQuantity` (Locator) | Quantity per item |
| `payment-info-value` | div | `paymentInfoValue` (Locator) | Assert payment method shown |
| `shipping-info-value` | div | `shippingInfoValue` (Locator) | Assert shipping method shown |
| `subtotal-label` | div | `subtotalLabel` (Locator) | Assert item total |
| `tax-label` | div | `taxLabel` (Locator) | Assert tax amount |
| `total-label` | div | `totalLabel` (Locator) | Assert final total |

**Deferred (add when test needs it):**
- `title` — if a test needs to assert page title "Checkout: Overview"
- `inventory-item-desc` — if a test needs to assert item description is shown

---

## Section 4 — Q&A

**Q: Is there a remove button on this page?**

No. Confirmed by scrape — no `remove-{slug}` exists on `/checkout-step-two.html`. The overview page is read-only. To change the order, the user must cancel and go back. You saw it initially on a different page state — likely still in the cart view.

---

**Q: `inventory-item-name` vs `item-0-title-link` — same distinction as CartPage?**

Yes, exactly. `inventory-item-name` is a `div` that holds the display text. `item-0-title-link` is the actual `<a>` element that navigates. The index in `item-0-title-link` changes per item: `item-0-title-link`, `item-1-title-link`, etc. The page object method takes an index:

```typescript
getItemTitleLink(index: number): Locator {
  return this.page.getByTestId(`item-${index}-title-link`);
}
```

---

**Q: When noting a label element — exact text assertion or just existence?**

That's a test decision, not a page object decision. The page object exposes the locator (`paymentInfoValue`). The test decides what to assert:
- `toBeVisible()` — element is present
- `toHaveText('SauceCard #31337')` — exact text matches
- `toContainText('SauceCard')` — partial match

For label elements like `payment-info-label` (always says "Payment Information:"), asserting text is low value — the label rarely changes. For value elements like `payment-info-value`, asserting the value is meaningful. This is why labels are deferred and values are in scope.

---

**Q: How do we test the math — does subtotal + tax = total?**

Two approaches:

**Option 1 — Assert fixed values (simple, sufficient for SauceDemo):**
SauceDemo prices are hardcoded. For one Bike Light:
```typescript
await expect(checkoutOverviewPage.subtotalLabel).toHaveText('Item total: $9.99');
await expect(checkoutOverviewPage.taxLabel).toHaveText('Tax: $0.80');
await expect(checkoutOverviewPage.totalLabel).toHaveText('Total: $10.79');
```

**Option 2 — Parse and compute (real-world approach):**
```typescript
const subtextText = await checkoutOverviewPage.subtotalLabel.innerText(); // "Item total: $9.99"
const taxText = await checkoutOverviewPage.taxLabel.innerText();           // "Tax: $0.80"
const totalText = await checkoutOverviewPage.totalLabel.innerText();       // "Total: $10.79"

const subtotal = parseFloat(subtextText.replace(/[^0-9.]/g, ''));
const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));

expect(subtotal + tax).toBeCloseTo(total, 2);
```

For SauceDemo: Option 1 is enough. Option 2 is worth knowing for real projects with dynamic pricing.

---

## Key Learnings from This Session

### No remove button on overview — page is read-only for items
Unlike the cart page, the checkout overview has no `remove-{slug}`. Users can only cancel and go back. Always verify assumptions like this with the scrape.

### `inventory-item-name` is a div, `item-0-title-link` is the link — again
Same pattern as CartPage. The display text and the clickable link are always separate elements in SauceDemo. Default to the `item-{index}-title-link` when you need to click a product title.

### Label vs value elements — assert values, not labels
Static labels (`payment-info-label`, `shipping-info-label`) rarely change — low assertion value. Value elements (`payment-info-value`, `shipping-info-value`) carry meaningful state — assert these.

### Math testing — fixed vs computed
For static test sites, asserting fixed strings is sufficient. For real apps with dynamic pricing, parse the strings and compute. `toBeCloseTo(total, 2)` handles floating point rounding.

---

## Deferred Decisions

| Decision | Trigger |
|---|---|
| Global elements (header, sidebar) | When duplication appears across 2+ page objects |
| `getItemTitleLink(index)` — multi-item tests | When E2E test adds multiple products |
| Math computation (Option 2) | When moving to a real app with dynamic pricing |
