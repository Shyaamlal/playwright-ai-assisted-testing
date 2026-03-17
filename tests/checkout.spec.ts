import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutInfoPage } from '../pages/checkout-info-page';
import { CheckoutOverviewPage } from '../pages/checkout-overview-page';
import { ConfirmationPage } from '../pages/confirmation-page';
import { TEST_USERS } from './test-data/users';
import { PRODUCTS } from './test-data/products';
import { CUSTOMER } from './test-data/customer';

/**
 * Test Suite: Checkout E2E
 * Application: saucedemo.com
 * Scope: Happy path — full checkout journey from product selection to order confirmation
 */

test.describe('Checkout', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    confirmationPage = new ConfirmationPage(page);
  });

  test('should complete full checkout journey from product selection to order confirmation', async ({ page }) => {
    // STEP 1 — Add product to cart
    await productsPage.addToCart(PRODUCTS.backpack.addToCart);
    await expect(productsPage.cartBadge).toHaveText('1');

    // STEP 2 — Navigate to cart
    await productsPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.checkoutButton).toBeVisible();

    // STEP 3 — Proceed to checkout info
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInfoPage.continueButton).toBeVisible();

    // STEP 4 — Fill checkout info and continue
    await checkoutInfoPage.fillForm(
      CUSTOMER.standard.firstName,
      CUSTOMER.standard.lastName,
      CUSTOMER.standard.postalCode
    );
    await checkoutInfoPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.finishButton).toBeVisible();

    // STEP 5 — Verify order summary: parse values and confirm math adds up
    // Product-agnostic: works for any product without hardcoding prices
    const subtotal = parseFloat((await checkoutOverviewPage.subtotalLabel.innerText()).replace(/[^0-9.]/g, ''));
    const tax = parseFloat((await checkoutOverviewPage.taxLabel.innerText()).replace(/[^0-9.]/g, ''));
    const total = parseFloat((await checkoutOverviewPage.totalLabel.innerText()).replace(/[^0-9.]/g, ''));
    expect.soft(subtotal).toBeGreaterThan(0);
    expect.soft(tax).toBeGreaterThan(0);
    expect.soft(subtotal + tax).toBeCloseTo(total, 2);

    // STEP 6 — Finish order
    await checkoutOverviewPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(confirmationPage.successHeader).toHaveText('Thank you for your order!');
  });
});
