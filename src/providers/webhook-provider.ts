/**
 * Generic HTTP webhook provider
 */

import type { WebhookProfile, NotificationResult } from "../types.js";
import { BaseProvider } from "./base-provider.js";

export class WebhookProvider extends BaseProvider {
  readonly name = "webhook";

  /**
   * Send a message to generic webhook
   */
  async send(message: string, profile: WebhookProfile): Promise<NotificationResult> {
    const body = {
      message,
      text: message,
      content: message,
    };

    return this.executeRequest(
      {
        url: profile.url,
        body,
        headers: profile.headers,
        timeout: 30000,
      },
      this.name,
    );
  }

  /**
   * Test the webhook connectivity
   */
  async test(profile: WebhookProfile): Promise<NotificationResult> {
    const testMessage = "🔔 Webhook test successful - notifycli is configured correctly";
    return this.send(testMessage, profile);
  }
}
