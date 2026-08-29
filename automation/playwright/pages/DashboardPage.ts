import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly welcomeHeader: Locator;
  readonly appointmentsCard: Locator;
  readonly consultationsList: Locator;
  readonly bookAppointmentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeader = page.getByRole('heading', { level: 1 });
    this.appointmentsCard = page.getByTestId('appointments-summary-card');
    this.consultationsList = page.getByTestId('consultations-list');
    this.bookAppointmentButton = page.getByRole('button', { name: /book appointment/i });
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.welcomeHeader).toBeVisible();
  }

  async clickBookAppointment(): Promise<void> {
    await this.bookAppointmentButton.click();
  }
}
