/**
 * Provider exports and factory
 */

import type { Profile, Provider, NotificationResult } from "../types.js";
import { DiscordProvider } from "./discord-provider.js";
import { SlackProvider } from "./slack-provider.js";
import { WebhookProvider } from "./webhook-provider.js";

export { DiscordProvider, SlackProvider, WebhookProvider };

export class UnknownProviderError extends Error {
  constructor(providerType: string) {
    super(`Unknown provider type: ${providerType}`);
    this.name = "UnknownProviderError";
  }
}

/**
 * Get provider instance for a profile type
 */
export function getProvider(profile: Profile): Provider {
  switch (profile.type) {
    case "discord":
      return new DiscordProvider();
    case "slack":
      return new SlackProvider();
    case "webhook":
      return new WebhookProvider();
    default: {
      // Type assertion to handle unknown types
      const unknownType = (profile as Profile).type;
      throw new UnknownProviderError(unknownType);
    }
  }
}

/**
 * Send notification using the appropriate provider for a profile
 */
export async function sendNotification(
  profile: Profile,
  profileName: string,
  message: string,
): Promise<NotificationResult> {
  const provider = getProvider(profile);
  return provider.send(message, profile);
}

/**
 * Test a profile using the appropriate provider
 */
export async function testProfile(
  profile: Profile,
  profileName: string,
): Promise<NotificationResult> {
  const provider = getProvider(profile);
  return provider.test(profile);
}
