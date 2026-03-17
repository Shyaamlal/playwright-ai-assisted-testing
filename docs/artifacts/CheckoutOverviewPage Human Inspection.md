# Human Inspection — Checkout Overview Page

**Date:** 2026-03-17
**URL / path:** `/checkout-step-two.html`
**How to reach this page:** Login → add item to cart → cart → checkout → fill name/postcode → Continue

---

## What I See

*Walk the page top to bottom. Describe every visible element in plain English — buttons, labels, text, inputs, images, links.*

- At the top, I see a text on the left side of the page which says "Checkout: Overview". 
- Like the previous page, I see a list of items I have added to the cart. I see the same format of quantity and description div here. This includes:
- quantity
- description
- the actual number
- the title in brackets
- link text
- the actual description of the product
- the price of the product in dollars 
- I can click the title of the product as link text. And that would navigate away from this page. When I do, I have to go back to the cart page and the checkout info page to come to the checkout overview page. That is, the entire user journey needs to be repeated. 
- I also see text that can't be changed in any way. They include payment information, Shipping information and the total price of the products. The payment information has a dummy card number. The shipping information is dummy shipping information. The price total contains the total price of the item (in this case, one price), and there is a tax item. There is a total combining both. 
- Like the cart page, there are also two buttons: Finish and cancel. Clicking on Finish goes forward. Click on Cancel goes back to the checkout info page.  

---

## Interactive Elements

*What can I click, type into, or select?*

| data-test | Element | Notes |
|-----------|---------|-------|
| cancel | Cancel button | |
| finish | Finish button | |
| inventory-item-name | Title link text | |
---

## Display Elements

*What is shown but not interacted with? Prices, summaries, error messages, badges.*

| data-test | Element | Notes |
|-----------|---------|-------|
| inventory-item-desc | Description of the item | |
| inventory-item-price | Price of the item | |
| item-quantity | Quantity of the item | |
| payment-info-label | 'Payment information' label | |
| payment-info-value | Saucecard dummy value | |
| shipping-info-label | 'Shipping information' label | |
| shipping-info-value | Dummpy shipping value | |
| total-info-label | 'Price Total' label | |
| subtotal-label | 'Item total' label | |
| tax-label | 'Tax' label | |
| total-label | 'Total' label | |
---

## States & Behaviour

*Does anything change depending on what the user did before arriving here?*

- I don't see any state changes within the page. I can only see that clicking the buttons would navigate out of the page, and clicking the title link text would also navigate out of the page to the product page, to be exact. 

---

## Questions / Uncertainties

*Anything I'm not sure about — note it here for the AI scrape to confirm.*

- I thought I saw a remove button; then, when I logged in again and navigated to the page, I did not see it anymore. 
- I think I have the same question as last time. How do I abstract this so that I can do this irrespective of the number of products in the page? Two examples, The inventory item name looks common in the data test attribute. But, if there are ten products, How do I differentiate between them? Also, if I have to scroll down to check the entire page, How do I think about that?
- In the element field, When I note down a label, do I actually say the exact text label? Because we also want to check the editorial content, right? Say the website is rolled out in different languages in different countries. Maybe the only thing that needs to be tested is the languages, in this case the exact labels. 
- How do we deal with the math? For example, if there are three products, how do I check if the pricing and total labels match what needs to be there? Because currently I'm thinking of them as text labels and not variables. 
