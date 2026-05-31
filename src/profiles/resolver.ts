/**
 * Profile resolver module
 *
 * Resolves profile definitions by name from configuration.
 */

import type { Config, Profile } from "../types.js";

export class ProfileNotFoundError extends Error {
  constructor(profileName: string, availableProfiles: readonly string[]) {
    const suggestion =
      availableProfiles.length > 0
        ? `\n\nAvailable profiles:\n${availableProfiles.map((p) => `  - ${p}`).join("\n")}`
        : "";

    super(`Profile "${profileName}" not found in configuration.${suggestion}`);
    this.name = "ProfileNotFoundError";
  }
}

/**
 * Resolve a profile by name from configuration
 *
 * @param config - The loaded and validated configuration
 * @param profileName - The name of the profile to resolve
 * @returns The profile definition
 * @throws ProfileNotFoundError if the profile doesn't exist
 */
export function resolveProfile(config: Config, profileName: string): Profile {
  const profile = config.profiles[profileName];

  if (!profile) {
    const availableProfiles = Object.keys(config.profiles);
    throw new ProfileNotFoundError(profileName, availableProfiles);
  }

  return profile;
}

/**
 * Get the provider type for a profile
 */
export function getProfileType(profile: Profile): string {
  return profile.type;
}

/**
 * Check if a profile exists in configuration
 */
export function profileExists(config: Config, profileName: string): boolean {
  return profileName in config.profiles;
}

/**
 * Get all available profiles with their types
 */
export function getAllProfiles(config: Config): Array<{ name: string; type: string }> {
  return Object.entries(config.profiles).map(([name, profile]) => ({
    name,
    type: profile.type,
  }));
}
