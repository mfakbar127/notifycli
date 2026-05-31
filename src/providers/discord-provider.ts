/**
 * Discord webhook provider
 */

import type { DiscordProfile, NotificationResult } from "../types.js";
import { BaseProvider } from "./base-provider.js";

export class DiscordProvider extends BaseProvider {
  readonly name = "discord";

  /**
   * Send a message to Discord webhook
   */
  async send(message: string, profile: DiscordProfile): Promise<NotificationResult> {
    const body = {
      content: message,
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
   * Test the Discord webhook connectivity
   */
  async test(profile: DiscordProfile): Promise<NotificationResult> {
    const testMessage = "🔔 Webhook test successful - notifycli is configured correctly";
    return this.send(testMessage, profile);
  }
}
