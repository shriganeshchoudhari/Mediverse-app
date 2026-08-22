import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimulationViewerPage extends BasePage {
  readonly canvas: Locator;
  readonly presetButtons: Locator;
  readonly sliders: Locator;

  constructor(page: Page) {
    super(page);
    this.canvas = page.locator('canvas, svg[class*="anatomical"]').first();
    this.presetButtons = page.locator('button[class*="preset"], button:has-text("VTach"), button:has-text("Lung Window")');
    this.sliders = page.locator('input[type="range"]');
  }

  async selectPreset(presetName: string) {
    const btn = this.page.locator(`button:has-text("${presetName}")`).first();
    if (await btn.isVisible()) await btn.click();
  }
}
