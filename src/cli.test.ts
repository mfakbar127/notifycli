import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const exec = promisify(execFile);
const CLI_PATH = "./dist/cli.js";

describe("CLI", () => {
  it("prints help", async () => {
    const { stdout } = await exec("node", [CLI_PATH, "--help"]);
    expect(stdout).toContain("notifycli");
    expect(stdout).toContain("--provider");
    expect(stdout).toContain("--text");
    expect(stdout).toContain("--test");
  });

  it("shows version", async () => {
    const { stdout } = await exec("node", [CLI_PATH, "--version"]);
    expect(stdout).toContain("0.0.1");
  });

  it("errors when provider is missing", async () => {
    try {
      await exec("node", [CLI_PATH, "--text", "hello"]);
      expect.fail("Should have thrown");
    } catch (error) {
      const err = error as { stderr: string; code: number };
      expect(err.stderr).toContain("--provider is required");
      expect(err.code).toBe(2);
    }
  });

  it("errors when message source is missing", async () => {
    const tmpDir = mkdtempSync(join(tmpdir(), "notifycli-test-"));
    const configPath = join(tmpDir, "notifycli.yaml");
    writeFileSync(
      configPath,
      `profiles:\n  test:\n    type: discord\n    webhook_url: https://example.com/webhook\n`,
    );

    try {
      await exec("node", [CLI_PATH, "--provider", "test", "--config", configPath]);
      expect.fail("Should have thrown");
    } catch (error) {
      const err = error as { stderr: string; code: number };
      expect(err.stderr).toContain("Either --text or --text-file is required");
      expect(err.code).toBe(2);
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });

  it("errors when both text and text-file are provided", async () => {
    const tmpDir = mkdtempSync(join(tmpdir(), "notifycli-test-"));
    const configPath = join(tmpDir, "notifycli.yaml");
    writeFileSync(
      configPath,
      `profiles:\n  test:\n    type: discord\n    webhook_url: https://example.com/webhook\n`,
    );

    try {
      await exec("node", [
        CLI_PATH,
        "--provider",
        "test",
        "--config",
        configPath,
        "--text",
        "hello",
        "--text-file",
        "/tmp/test.txt",
      ]);
      expect.fail("Should have thrown");
    } catch (error) {
      const err = error as { stderr: string; code: number };
      expect(err.stderr).toContain("Cannot use both --text and --text-file");
      expect(err.code).toBe(2);
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });
});
