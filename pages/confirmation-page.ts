import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Confirmation Page
 * Application: saucedemo.com
 * URL: /checkout-complete.html
 *
 * Contains elements and actions for the order confirmation page.
 * Reached by clicking Finish on the checkout overview page.
 */
export class ConfirmationPage {
  readonly page: Page;

  // Static locators — always present on the page
  readonly backHomeButton: Locator;
  readonly confirmationImage: Locator;
  readonly successHeader: Locator;
  readonly successText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backHomeButton = page.getByTestId('back-to-products');
    this.confirmationImage = page.getByTestId('pony-express');
    this.successHeader = page.getByTestId('complete-header');
    this.successText = page.getByTestId('complete-text');
  }

  /**
   * Return to the products page after order completion.
   */
  async goBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
