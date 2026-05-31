/**
 * notifycli - Unified notification system CLI
 *
 * CLI entry point for sending notifications through
 * Slack, Discord, and generic webhooks.
 */

import process from "node:process";
import { defineCommand, runMain } from "citty";
import { NotificationService } from "./services/notification-service.js";
import { loadMessage } from "./messaging/load-text.js";
import {
  formatNotificationResult,
  formatTestResult,
  formatHelp,
  getExitCode,
} from "./output/formatter.js";

const main = defineCommand({
  meta: {
    name: "notifycli",
    version: "0.0.1",
    description:
      "Unified notification system CLI for testing and sending notifications through external messaging providers",
  },
  args: {
    provider: {
      type: "string",
      description: "Profile name from configuration (required)",
      required: false,
    },
    text: {
      type: "string",
      description: "Message text to send",
      required: false,
    },
    "text-file": {
      type: "string",
      description: "Path to file containing message",
      required: false,
    },
    test: {
      type: "boolean",
      description: "Test profile connectivity",
      default: false,
    },
    config: {
      type: "string",
      description: "Path to configuration file",
      required: false,
    },
    json: {
      type: "boolean",
      description: "Output in JSON format",
      default: false,
    },
    help: {
      type: "boolean",
      description: "Show help message",
      default: false,
    },
  },
  async run({ args }) {
    // Show help
    if (args.help) {
      console.log(formatHelp());
      process.exit(0);
    }

    // Validate required arguments
    if (!args.provider) {
      console.error("Error: --provider is required");
      console.error("\n" + formatHelp());
      process.exit(2);
    }

    // Validate message source for non-test mode
    if (!args.test && !args.text && !args["text-file"]) {
      console.error("Error: Either --text or --text-file is required (or use --test)");
      console.error("\n" + formatHelp());
      process.exit(2);
    }

    // Validate that only one message source is provided
    if (args.text && args["text-file"]) {
      console.error("Error: Cannot use both --text and --text-file");
      process.exit(2);
    }

    try {
      const service = new NotificationService();
      await service.loadConfiguration(args.config);

      // Test mode
      if (args.test) {
        const result = await service.testProfile({ profileName: args.provider });
        console.log(formatTestResult(result, { json: args.json }));
        process.exit(result.success ? 0 : 1);
      }

      // Send notification mode
      const result = await service.sendNotification({
        profileName: args.provider,
        text: args.text,
        textFile: args["text-file"],
      });

      console.log(formatNotificationResult(result, { json: args.json }));
      process.exit(result.success ? 0 : 1);
    } catch (error) {
      if (args.json) {
        console.error(
          JSON.stringify(
            {
              success: false,
              error: error instanceof Error ? error.message : String(error),
            },
            null,
            2,
          ),
        );
      } else {
        console.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      process.exit(1);
    }
  },
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nInterrupted.");
  process.exit(130);
});

void runMain(main);
