import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Checkout Overview Page
 * Application: saucedemo.com
 * URL: /checkout-step-two.html
 *
 * Contains elements and actions for the order summary page.
 * Reached by completing the checkout info form.
 */
export class CheckoutOverviewPage {
  readonly page: Page;

  // Static locators — always present on the page
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.paymentInfoValue = page.getByTestId('payment-info-value');
    this.shippingInfoValue = page.getByTestId('shipping-info-value');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.itemPrice = page.getByTestId('inventory-item-price');
    this.itemQuantity = page.getByTestId('item-quantity');
  }

  /**
   * Get the title link for a cart item by index.
   * Navigates to the product detail page when clicked.
   * @param index - Zero-based index of the item in the list
   */
  getItemTitleLink(index: number): Locator {
    return this.page.getByTestId(`item-${index}-title-link`);
  }

  /**
   * Confirm the order and proceed to the confirmation page.
   */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Cancel and go back to the checkout info page.
   */
  async cancelOrder(): Promise<void> {
    await this.cancelButton.click();
  }
}
