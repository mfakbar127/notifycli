/**
 * Configuration loading module
 *
 * Handles loading YAML configuration files from various sources.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, isAbsolute, join, dirname } from "node:path";
import { homedir } from "node:os";
import { load as loadYaml } from "js-yaml";
import type { Config } from "../types.js";

export class ConfigNotFoundError extends Error {
  constructor(searchPaths: readonly string[]) {
    super(
      `Configuration file not found. Searched:\n${searchPaths.map((p) => `  - ${p}`).join("\n")}`,
    );
    this.name = "ConfigNotFoundError";
  }
}

export class ConfigParseError extends Error {
  constructor(filePath: string, cause: string) {
    super(`Failed to parse configuration file ${filePath}: ${cause}`);
    this.name = "ConfigParseError";
  }
}

const DEFAULT_CONFIG_FILENAMES = ["notifycli.yaml", "notifycli.yml"];
const GLOBAL_CONFIG_DIR = join(homedir(), ".config", "notifycli");
const GLOBAL_CONFIG_FILENAMES = ["config.yaml", "config.yml"];

/**
 * Get list of configuration file paths to search
 */
function getConfigSearchPaths(explicitPath?: string): string[] {
  const paths: string[] = [];

  // 1. Explicit --config path
  if (explicitPath) {
    paths.push(explicitPath);
    return paths;
  }

  // 2. Local directory (current working directory)
  const cwd = process.cwd();
  for (const filename of DEFAULT_CONFIG_FILENAMES) {
    paths.push(join(cwd, filename));
  }

  // 3. Global config directory
  for (const filename of GLOBAL_CONFIG_FILENAMES) {
    paths.push(join(GLOBAL_CONFIG_DIR, filename));
  }

  return paths;
}

/**
 * Resolve an absolute path from a relative or absolute path
 */
function resolvePath(filePath: string): string {
  return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
}

/**
 * Load and parse a YAML configuration file
 */
function loadConfigFile(filePath: string): Config {
  const resolvedPath = resolvePath(filePath);

  try {
    const content = readFileSync(resolvedPath, "utf-8");
    const parsed = loadYaml(content) as Record<string, unknown>;

    if (!parsed || typeof parsed !== "object") {
      throw new ConfigParseError(resolvedPath, "Configuration must be an object");
    }

    if (!parsed.profiles || typeof parsed.profiles !== "object") {
      throw new ConfigParseError(resolvedPath, "Missing or invalid 'profiles' section");
    }

    return parsed as Config;
  } catch (error) {
    if (error instanceof ConfigParseError) {
      throw error;
    }

    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new ConfigNotFoundError([resolvedPath]);
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new ConfigParseError(resolvedPath, message);
  }
}

/**
 * Find and load configuration file
 *
 * @param explicitPath - Optional explicit path from --config flag
 * @returns The loaded configuration
 * @throws ConfigNotFoundError if no config file is found
 * @throws ConfigParseError if the config file is invalid
 */
export function loadConfig(explicitPath?: string): Config {
  const searchPaths = getConfigSearchPaths(explicitPath);

  for (const path of searchPaths) {
    const resolvedPath = resolvePath(path);
    if (existsSync(resolvedPath)) {
      return loadConfigFile(resolvedPath);
    }
  }

  throw new ConfigNotFoundError(searchPaths);
}

/**
 * Check if a configuration file exists at the given path or in default locations
 */
export function configExists(explicitPath?: string): boolean {
  const searchPaths = getConfigSearchPaths(explicitPath);

  return searchPaths.some((path) => existsSync(resolvePath(path)));
}
