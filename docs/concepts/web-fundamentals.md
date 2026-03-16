# Web Fundamentals

Core web concepts that come up during test automation. Not Playwright-specific — foundational knowledge that applies to any web testing tool.

---

## HTML, DOM, and JavaScript — How They Relate

Three separate things that work together:

**HTML** — the structure and content of the page, written by the developer. A static document.

**CSS** — styles the HTML. Changes how things look (colour, layout, size), not what they are.

**JavaScript** — a programming language that runs in the browser. It can read and modify the DOM after the page loads.

---

## What is the DOM?

**DOM = Document Object Model.**

When a browser loads an HTML file, it doesn't just display it as text — it parses it and builds a tree of objects in memory. Each HTML tag becomes a node in that tree. This tree is the DOM.

```
HTML tag        →   DOM node
<html>          →   root node
  <body>        →   child of root
    <form>      →   child of body
      <input>   →   child of form
```

The DOM exists so that JavaScript has a structured, programmable representation of the page — something it can navigate, query, and modify:

```javascript
document.querySelector('[data-test="error"]')  // find a node
node.textContent = 'new text'                  // change it
node.remove()                                  // delete it
```

Without the DOM, JavaScript would have to parse raw HTML strings every time — fragile and slow.

---

## What Does JavaScript Actually Do?

JavaScript's main job on a web page: **make changes to parts of the page without the browser rebuilding the whole thing.**

**Before JavaScript was widely used:**
Every user action → request to the server → server returns full HTML → browser rebuilds entire DOM → page reloads. Slow, jarring.

**With JavaScript:**
User action → JavaScript modifies just the relevant DOM node → rest of the page untouched → user sees the change instantly. No reload.

This is what makes modern web apps feel like apps rather than documents. Gmail, Google Maps, SauceDemo's cart counter — all JavaScript making surgical changes to the DOM.

---

## What if There's No JavaScript?

The DOM is still built. JavaScript doesn't create the DOM — the browser does. JavaScript just uses it.

A pure HTML page with no JavaScript has a full DOM. It's just frozen — nothing modifies it after the initial load. Every user interaction requires a full page reload.

Old websites worked this way. The web moved to JavaScript because users expect things to happen *without* reloading.

---

## Why This Matters for Testing

**Dynamic elements only exist after interaction.**

When Playwright scrapes a page on load, it sees the initial DOM. Elements injected by JavaScript after user actions — error messages, loading states, cart updates — are not there yet.

This is why:
- The error element on the checkout form wasn't found in the initial DOM scrape
- It only appeared *after* the Continue button was clicked and JavaScript injected it
- Playwright's auto-waiting handles this — it retries finding elements until they appear

**Static inspection is not enough.** Always verify error states, empty states, and post-action states by triggering the interaction, not just inspecting the initial page.

---

## The Accessibility Tree

The accessibility tree is a simplified, parallel representation of the DOM — built specifically for screen readers and assistive tools. It describes *what elements do*, not just what they are.

Playwright MCP reads the accessibility tree (not the raw DOM) when taking snapshots. A `<button>` appears as `button "Login"`. A `<div>` with no role appears as `generic`.

**If a site has poor accessibility:**
- Generic `div` soup → accessibility tree is nearly useless
- Fall back to DOM scraping: `document.querySelectorAll('[data-test]')`

**If a site has good accessibility:**
- `getByRole('button', { name: 'Login' })` works reliably
- Playwright MCP snapshots are readable and meaningful

SauceDemo has `data-test` attributes everywhere — DOM scraping is the primary strategy here. The accessibility tree is a useful cross-check.

---

## Sources

- Concepts learned during CheckoutInfoPage inspection session (2026-03-16)
- Q&A during CartPage and CheckoutInfoPage double-verification sessions
