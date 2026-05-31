/**
 * Core types for notifycli
 */

export interface BaseProfile {
  type: "discord" | "slack" | "webhook";
}

export interface DiscordProfile extends BaseProfile {
  type: "discord";
  webhook_url: string;
}

export interface SlackProfile extends BaseProfile {
  type: "slack";
  webhook_url: string;
}

export interface WebhookProfile extends BaseProfile {
  type: "webhook";
  url: string;
  headers?: Record<string, string>;
}

export type Profile = DiscordProfile | SlackProfile | WebhookProfile;

export interface Config {
  profiles: Record<string, Profile>;
}

export interface NotificationResult {
  success: boolean;
  provider: string;
  profileName: string;
  message?: string | undefined;
  error?: string | undefined;
}

export interface Provider {
  readonly name: string;
  send(message: string, profile: Profile): Promise<NotificationResult>;
  test(profile: Profile): Promise<NotificationResult>;
}
