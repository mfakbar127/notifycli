/**
 * Configuration validator module
 *
 * Validates configuration structure and required fields.
 */

import type { Config, Profile, DiscordProfile, SlackProfile, WebhookProfile } from "../types.js";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a configuration object
 */
export function validateConfig(config: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!config || typeof config !== "object") {
    errors.push({ field: "root", message: "Configuration must be an object" });
    return { valid: false, errors };
  }

  const cfg = config as Record<string, unknown>;

  // Check for profiles section
  if (!cfg.profiles || typeof cfg.profiles !== "object") {
    errors.push({ field: "profiles", message: "Configuration must have a 'profiles' object" });
    return { valid: false, errors };
  }

  const profiles = cfg.profiles as Record<string, unknown>;

  // Validate each profile
  for (const [name, profile] of Object.entries(profiles)) {
    if (!profile || typeof profile !== "object") {
      errors.push({ field: `profiles.${name}`, message: "Profile must be an object" });
      continue;
    }

    const profileErrors = validateProfile(name, profile as Record<string, unknown>);
    errors.push(...profileErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a single profile
 */
function validateProfile(name: string, profile: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check type field
  if (!profile.type) {
    errors.push({ field: `profiles.${name}.type`, message: "Profile must have a 'type' field" });
  } else if (typeof profile.type !== "string") {
    errors.push({ field: `profiles.${name}.type`, message: "Profile 'type' must be a string" });
  } else {
    // Validate type-specific fields
    const type = profile.type as string;

    switch (type) {
      case "discord":
        if (!profile.webhook_url || typeof profile.webhook_url !== "string") {
          errors.push({
            field: `profiles.${name}.webhook_url`,
            message: "Discord profile must have a 'webhook_url' string",
          });
        }
        break;

      case "slack":
        if (!profile.webhook_url || typeof profile.webhook_url !== "string") {
          errors.push({
            field: `profiles.${name}.webhook_url`,
            message: "Slack profile must have a 'webhook_url' string",
          });
        }
        break;

      case "webhook":
        if (!profile.url || typeof profile.url !== "string") {
          errors.push({
            field: `profiles.${name}.url`,
            message: "Webhook profile must have a 'url' string",
          });
        }
        break;

      default:
        errors.push({
          field: `profiles.${name}.type`,
          message: `Unknown profile type: "${type}". Must be "discord", "slack", or "webhook"`,
        });
    }
  }

  return errors;
}

/**
 * Check if a profile is valid for a specific type
 */
export function isDiscordProfile(profile: Profile): profile is DiscordProfile {
  return profile.type === "discord" && "webhook_url" in profile;
}

export function isSlackProfile(profile: Profile): profile is SlackProfile {
  return profile.type === "slack" && "webhook_url" in profile;
}

export function isWebhookProfile(profile: Profile): profile is WebhookProfile {
  return profile.type === "webhook" && "url" in profile;
}
