/**
 * Message loading and validation module
 *
 * Handles loading messages from CLI arguments or files.
 */

import { readTextFile } from "../utils/filesystem.js";

export class EmptyMessageError extends Error {
  constructor() {
    super("Message cannot be empty");
    this.name = "EmptyMessageError";
  }
}

export class FileLoadError extends Error {
  constructor(filePath: string, cause: string) {
    super(`Failed to load message from file: ${filePath} - ${cause}`);
    this.name = "FileLoadError";
  }
}

/**
 * Load message content from a file
 *
 * @param filePath - Path to the text file
 * @returns The file contents as a string
 * @throws FileLoadError if the file cannot be read
 */
export function loadMessageFromFile(filePath: string): string {
  try {
    const content = readTextFile(filePath);
    return content;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new FileLoadError(filePath, message);
  }
}

/**
 * Validate that a message is not empty or just whitespace
 *
 * @param message - The message to validate
 * @returns The trimmed message if valid
 * @throws EmptyMessageError if the message is empty
 */
export function validateMessage(message: string): string {
  const trimmed = message.trim();

  if (trimmed.length === 0) {
    throw new EmptyMessageError();
  }

  return trimmed;
}

/**
 * Load and validate message from text input
 *
 * @param text - Raw text input
 * @returns Validated message
 * @throws EmptyMessageError if text is empty after trimming
 */
export function loadMessageFromText(text: string): string {
  return validateMessage(text);
}

/**
 * Load message from either text or file source
 *
 * Priority: text argument takes precedence over filePath
 *
 * @param options - Object containing either text or filePath
 * @returns The validated message content
 * @throws EmptyMessageError if the loaded message is empty
 * @throws FileLoadError if the file cannot be read
 */
export function loadMessage(options: { text?: string; filePath?: string }): string {
  if (options.text !== undefined) {
    return loadMessageFromText(options.text);
  }

  if (options.filePath !== undefined) {
    const content = loadMessageFromFile(options.filePath);
    return validateMessage(content);
  }

  throw new Error("No message source provided");
}
