# 06 — E2E Tests, Naming Conventions, and Assertion Strategy

**Date:** 2026-03-17

---

## Test Naming Conventions

### The `should` convention
The most common pattern in professional Playwright/Jest projects:

```typescript
test.describe('Checkout', () => {
  test('should complete full checkout journey from product selection to order confirmation')
  test('should show error when checkout info is missing')
});
```

The `describe` block = the feature or flow.
The `test()` name = the specific behaviour being verified.
Together they read as a sentence: *"Checkout — should complete full checkout journey..."*

**Rule:** Test names describe *what should happen*, not *what the test does.*
- ❌ `test('checkout flow test')`
- ✅ `test('should complete full checkout journey...')`

### Gherkin / BDD style
Used with Cucumber or similar BDD frameworks. Less common in pure Playwright:
```
Given I am logged in as standard_user
When I add the Backpack to cart and complete checkout
Then I should see the order confirmation
```
Not used in this project — but worth knowing when reading enterprise test suites.

### Comments inside tests
Three approaches seen in professional codebases:

| Style | When used |
|---|---|
| `// STEP 1 — Add product to cart` | Tutorial/portfolio projects, learning codebases, onboarding |
| No comments — self-documenting code | Experienced teams with expressive page object methods |
| `// ARRANGE / ACT / ASSERT` | Academic, rarely seen in practice |

For this project: `// STEP` comments stay — they aid learning and make the journey readable.

---

## Assertion Strategy in Multi-Step Flows

### Hard vs Soft (see also foundations.md §11)

```typescript
// Hard — stops test immediately. Use for navigation/routing.
await expect(page).toHaveURL(/cart\.html/);

// Soft — records failure, continues. Use for related data checks.
await expect.soft(overviewPage.subtotalLabel).toHaveText('Item total: $29.99');
await expect.soft(overviewPage.taxLabel).toHaveText('Tax: $2.40');
await expect.soft(overviewPage.totalLabel).toHaveText('Total: $32.39');
```

### URL vs Element assertions
When you know the URL: assert both — URL for routing, element for content.
When you don't know the URL: assert the most distinctive element on the page.

```typescript
// URL known — assert both
await expect(page).toHaveURL(/checkout-complete\.html/);
await expect(confirmationPage.successHeader).toHaveText('Thank you for your order!');

// URL unknown — element only
await expect(confirmationPage.successHeader).toBeVisible();
```

### Price/math assertions — two layers

**Layer 1 — Math check (product-agnostic):**
Parse values from the page and verify they add up. Works for any product.
```typescript
const subtotal = parseFloat((await overviewPage.subtotalLabel.innerText()).replace(/[^0-9.]/g, ''));
const tax = parseFloat((await overviewPage.taxLabel.innerText()).replace(/[^0-9.]/g, ''));
const total = parseFloat((await overviewPage.totalLabel.innerText()).replace(/[^0-9.]/g, ''));
expect.soft(subtotal + tax).toBeCloseTo(total, 2);
```

**Layer 2 — Value check (product-specific, future):**
Assert specific prices from test data. Catches unauthorised price changes.
```typescript
// Future: extend PRODUCTS with price data
// backpack: { addToCart: '...', remove: '...', price: 29.99 }
// TAX_RATE = 0.08
await expect.soft(overviewPage.subtotalLabel).toHaveText(`Item total: $${PRODUCTS.backpack.price}`);
```

Both layers together = full coverage. Layer 1 now. Layer 2 when price verification becomes a test requirement.

---

## E2E Test Structure Pattern

```typescript
test.describe('Feature', () => {
  // Declare page objects outside beforeEach so they're accessible in tests
  let pageA: PageA;
  let pageB: PageB;

  test.beforeEach(async ({ page }) => {
    // Login and shared setup
    pageA = new PageA(page);
    pageB = new PageB(page);
  });

  test('should [expected behaviour] when [condition]', async ({ page }) => {
    // STEP 1 — [action]
    await pageA.doSomething();
    await expect(page).toHaveURL(/expected/);        // hard — routing check
    await expect(pageA.keyElement).toBeVisible();    // hard — content check

    // STEP 2 — [action]
    await pageB.doSomethingElse();
    await expect.soft(pageB.valueA).toHaveText('x'); // soft — related data
    await expect.soft(pageB.valueB).toHaveText('y'); // soft — related data
  });
});
```
