/**
 * Configuration loader tests
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig, ConfigNotFoundError, ConfigParseError } from "../../config/loader.js";

const TEST_DIR = join(tmpdir(), "notifycli-test-" + Date.now());

describe("loadConfig", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("should load valid YAML configuration", () => {
    const configPath = join(TEST_DIR, "notifycli.yaml");
    writeFileSync(
      configPath,
      `
profiles:
  discord-alerts:
    type: discord
    webhook_url: https://discord.com/api/webhooks/test
  slack-eng:
    type: slack
    webhook_url: https://hooks.slack.com/services/test
`,
    );

    const config = loadConfig(configPath);
    expect(config.profiles).toBeDefined();
    expect(config.profiles["discord-alerts"]).toBeDefined();
    expect(config.profiles["discord-alerts"].type).toBe("discord");
  });

  it("should throw ConfigNotFoundError for missing file", () => {
    expect(() => loadConfig(join(TEST_DIR, "nonexistent.yaml"))).toThrow(
      ConfigNotFoundError,
    );
  });

  it("should throw ConfigParseError for invalid YAML", () => {
    const configPath = join(TEST_DIR, "invalid.yaml");
    writeFileSync(configPath, "not: valid: yaml: [");

    expect(() => loadConfig(configPath)).toThrow(ConfigParseError);
  });
});
