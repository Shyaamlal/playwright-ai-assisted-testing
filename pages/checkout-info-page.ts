import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Checkout Info Page
 * Application: saucedemo.com
 * URL: /checkout-step-one.html
 *
 * Contains elements and actions for the checkout information form.
 * Reached by clicking Checkout on the cart page.
 */
export class CheckoutInfoPage {
  readonly page: Page;

  // Static locators — always present on the page
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Fill the checkout form with customer information.
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param postalCode - Zip/postal code
   */
  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Submit the form and proceed to the order overview.
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Cancel and go back to the cart.
   */
  async goBackToCart(): Promise<void> {
    await this.cancelButton.click();
  }
}
