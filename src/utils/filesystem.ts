/**
 * Filesystem utilities
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, isAbsolute } from "node:path";

/**
 * Read file contents, resolving relative paths from current working directory
 *
 * @param filePath - Path to file (relative or absolute)
 * @returns File contents as string
 * @throws Error if file doesn't exist or can't be read
 */
export function readTextFile(filePath: string): string {
  const absolutePath = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    return readFileSync(absolutePath, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read file ${filePath}: ${message}`);
  }
}

/**
 * Check if a file exists
 *
 * @param filePath - Path to check
 * @returns True if file exists
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Detect if content might be binary (non-text data)
 */
export function isTextContent(content: string): boolean {
  // Basic check for null bytes which are rare in text
  return !content.includes("\0");
}
