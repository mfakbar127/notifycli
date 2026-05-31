/**
 * Output formatting module
 *
 * Formats CLI output for human readability and automation.
 */

import type { NotificationResult } from "../types.js";

// Simple ANSI color codes
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

function green(text: string): string {
  return `${GREEN}${text}${RESET}`;
}

function red(text: string): string {
  return `${RED}${text}${RESET}`;
}

function yellow(text: string): string {
  return `${YELLOW}${text}${RESET}`;
}

function bold(text: string): string {
  return `${BOLD}${text}${RESET}`;
}

function dim(text: string): string {
  return `${DIM}${text}${RESET}`;
}

export interface OutputOptions {
  /** Output in JSON format for automation */
  json?: boolean;
  /** Suppress output except errors */
  quiet?: boolean;
}

/**
 * Format a success message
 */
export function formatSuccess(message: string): string {
  return `${green("✓")} ${message}`;
}

/**
 * Format an error message
 */
export function formatError(message: string): string {
  return `${red("✗")} ${message}`;
}

/**
 * Format a warning message
 */
export function formatWarning(message: string): string {
  return `${yellow("⚠")} ${message}`;
}

/**
 * Format notification delivery result
 */
export function formatNotificationResult(
  result: NotificationResult,
  options: OutputOptions = {},
): string {
  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  if (result.success) {
    return formatSuccess(
      `Notification sent via ${bold(result.provider)} (${result.profileName})`,
    );
  } else {
    return formatError(
      `Failed to send via ${bold(result.provider)} (${result.profileName})${result.error ? `: ${result.error}` : ""}`,
    );
  }
}

/**
 * Format test result
 */
export function formatTestResult(
  result: NotificationResult,
  options: OutputOptions = {},
): string {
  if (options.json) {
    return JSON.stringify(
      {
        ...result,
        test: true,
      },
      null,
      2,
    );
  }

  if (result.success) {
    return formatSuccess(
      `Test successful for ${bold(result.provider)} profile "${result.profileName}"`,
    );
  } else {
    return formatError(
      `Test failed for ${bold(result.provider)} profile "${result.profileName}"${result.error ? `: ${result.error}` : ""}`,
    );
  }
}

/**
 * Format help text
 */
export function formatHelp(): string {
  const lines = [
    bold("notifycli - Unified notification system CLI"),
    "",
    dim("Send notifications to Slack, Discord, and webhooks"),
    "",
    bold("Usage:"),
    "  npx notifycli --provider <profile> --text <message>",
    "  npx notifycli --provider <profile> --text-file <path>",
    "  npx notifycli --provider <profile> --test",
    "",
    bold("Options:"),
    "  --provider <name>     Profile name from configuration (required)",
    "  --text <message>      Message text to send",
    "  --text-file <path>    Path to file containing message",
    "  --test                Test profile connectivity",
    "  --config <path>       Path to configuration file",
    "  --json                Output in JSON format",
    "  --help                Show this help message",
    "  --version             Show version number",
    "",
    bold("Examples:"),
    '  npx notifycli --provider discord-alerts --text "Hello World"',
    '  npx notifycli --provider slack-eng --text-file ./incident.txt',
    "  npx notifycli --provider discord-security --test",
  ];

  return lines.join("\n");
}

/**
 * Get appropriate exit code based on result
 */
export function getExitCode(results: NotificationResult[]): number {
  const hasFailure = results.some((r) => !r.success);
  return hasFailure ? 1 : 0;
}
