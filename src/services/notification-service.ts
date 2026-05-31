/**
 * Notification service - Orchestrates configuration loading, profile resolution,
 * and provider execution for sending notifications.
 */

import type { Config, Profile, NotificationResult } from "../types.js";
import { loadConfig, configExists } from "../config/loader.js";
import { resolveProfile } from "../profiles/resolver.js";
import { sendNotification, testProfile } from "../providers/index.js";
import { loadMessage } from "../messaging/load-text.js";

export interface NotificationOptions {
  /** Profile name to use */
  profileName: string;
  /** Message text to send */
  text?: string;
  /** File path containing message */
  textFile?: string;
  /** Path to configuration file */
  configPath?: string;
}

export interface TestOptions {
  /** Profile name to test */
  profileName: string;
  /** Path to configuration file */
  configPath?: string;
}

export class NotificationService {
  private config?: Config;

  /**
   * Load configuration from file system
   */
  async loadConfiguration(explicitPath?: string): Promise<Config> {
    this.config = loadConfig(explicitPath);
    return this.config;
  }

  /**
   * Check if configuration is loaded
   */
  isConfigured(): boolean {
    return this.config !== undefined;
  }

  /**
   * Get loaded configuration
   */
  getConfig(): Config {
    if (!this.config) {
      throw new Error("Configuration not loaded. Call loadConfiguration() first.");
    }
    return this.config;
  }

  /**
   * Send a notification using the specified profile
   */
  async sendNotification(options: NotificationOptions): Promise<NotificationResult> {
    const config = this.getConfig();
    const profile = resolveProfile(config, options.profileName);

    let message: string;
    if (options.text) {
      message = loadMessage({ text: options.text });
    } else if (options.textFile) {
      message = loadMessage({ filePath: options.textFile });
    } else {
      throw new Error("Either text or textFile must be provided");
    }

    return sendNotification(profile, options.profileName, message);
  }

  /**
   * Test a profile's connectivity
   */
  async testProfile(options: TestOptions): Promise<NotificationResult> {
    const config = this.getConfig();
    const profile = resolveProfile(config, options.profileName);
    return testProfile(profile, options.profileName);
  }
}

/**
 * Standalone function to send a notification
 */
export async function send(
  options: NotificationOptions,
): Promise<NotificationResult> {
  const service = new NotificationService();
  await service.loadConfiguration(options.configPath);
  return service.sendNotification(options);
}

/**
 * Standalone function to test a profile
 */
export async function test(
  options: TestOptions,
): Promise<NotificationResult> {
  const service = new NotificationService();
  await service.loadConfiguration(options.configPath);
  return service.testProfile(options);
}

export { configExists };
