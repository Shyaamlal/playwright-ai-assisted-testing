# Playwright E2E Framework — AI-Native Test Automation

A Playwright TypeScript framework for end-to-end testing of SauceDemo, built using a systematic, documented process where every test decision is traceable.

---

## The Process

Every page object follows this sequence:

```
1. Human inspection       — open the page, observe every element, note data-test values
2. AI scrape              — Playwright MCP scrapes all data-test attributes on the live page
3. Compare                — resolve discrepancies between human and AI observations
4. Locator review artifact — document agreed locators, scope decisions, Q&A, deferred decisions
5. Page object            — write the TypeScript class
6. TypeScript check       — npx tsc --noEmit across all files
7. Human review           — verify locators, assertions, scope, wait strategy
8. Commit
```

The artifacts are the primary record. The code is the output.

---

## What to Look At

**If you want to see the process:**
→ [`docs/artifacts/`](docs/artifacts/) — one locator review per page, with human + AI inspection, Q&A, and deferred decisions

**If you want to see the tests:**
→ [`tests/checkout.spec.ts`](tests/checkout.spec.ts) — full E2E checkout journey, passing on Chromium, Firefox, and WebKit
→ [`tests/add-to-cart.spec.ts`](tests/add-to-cart.spec.ts) — add to cart with acceptance criteria

**If you want to see the page objects:**
→ [`pages/`](pages/) — six page objects covering the full SauceDemo checkout flow

**If you want to see the test design approach:**
→ [`docs/concepts/process.md`](docs/concepts/process.md) — the full testing process from strategy to maintenance

---

## Test Coverage

| Flow | Type | Browsers | Status |
|---|---|---|---|
| Login — valid credentials | Happy path | Chromium, Firefox, WebKit | ✅ Passing |
| Login — locked user | Unhappy path | Chromium, Firefox, WebKit | ✅ Passing |
| Add to cart | Happy path | Chromium, Firefox, WebKit | ✅ Passing |
| Full checkout (product → confirmation) | E2E | Chromium, Firefox, WebKit | ✅ Passing |

---

## Running the Tests

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/checkout.spec.ts

# Run in UI mode (interactive — watch tests execute)
npx playwright test --ui

# View HTML report
npx playwright show-report
```

---

## Project Structure

```
playwright-e2e-framework-demo/
├── pages/                        # Page object classes
│   ├── login-page.ts
│   ├── products-page.ts
│   ├── cart-page.ts
│   ├── checkout-info-page.ts
│   ├── checkout-overview-page.ts
│   └── confirmation-page.ts
├── tests/
│   ├── checkout.spec.ts          # E2E — full checkout journey
│   ├── add-to-cart.spec.ts       # Add to cart
│   ├── login.spec.ts             # Login scenarios
│   └── test-data/                # TEST_USERS, PRODUCTS, CUSTOMER constants
├── docs/
│   ├── artifacts/                # Locator review documents — one per page
│   ├── concepts/                 # Process, locator strategy, test design reference
│   └── templates/                # Human inspection template
├── .github/workflows/            # CI/CD — runs on push and PR
├── playwright.config.ts
├── tsconfig.json
└── CLAUDE.md                     # AI collaboration guide
```

---

## Tech Stack

- **Playwright** — E2E testing across Chromium, Firefox, WebKit
- **TypeScript** — type-safe page objects and tests
- **GitHub Actions** — CI/CD on every push
- **Claude Code** — AI-assisted scraping, code generation, and process documentation

---

## Status

SauceDemo checkout flow is complete. Next: API testing layer.

| Layer | Status |
|---|---|
| Page objects — full checkout flow | ✅ Done |
| E2E tests — checkout journey | ✅ Done |
| API testing | 🚧 In progress |
