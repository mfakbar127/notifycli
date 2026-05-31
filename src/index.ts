#!/usr/bin/env node

/**
 * notifycli - Unified notification system CLI
 *
 * Core library exports for programmatic API usage.
 */

export type {
  Config,
  Profile,
  DiscordProfile,
  SlackProfile,
  WebhookProfile,
  NotificationResult,
  Provider,
} from "./types.js";

export { loadConfig } from "./config/loader.js";
export { validateConfig } from "./config/validator.js";
export { resolveProfile } from "./profiles/resolver.js";
export { NotificationService } from "./services/notification-service.js";
