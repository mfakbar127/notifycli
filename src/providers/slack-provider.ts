/**
 * Slack webhook provider
 */

import type { SlackProfile, NotificationResult } from "../types.js";
import { BaseProvider } from "./base-provider.js";

export class SlackProvider extends BaseProvider {
  readonly name = "slack";

  /**
   * Send a message to Slack webhook
   */
  async send(message: string, profile: SlackProfile): Promise<NotificationResult> {
    const body = {
      text: message,
    };

    return this.executeRequest(
      {
        url: profile.webhook_url,
        body,
        timeout: 30000,
      },
      this.name,
    );
  }

  /**
   * Test the Slack webhook connectivity
   */
  async test(profile: SlackProfile): Promise<NotificationResult> {
    const testMessage = "🔔 Webhook test successful - notifycli is configured correctly";
    return this.send(testMessage, profile);
  }
}
