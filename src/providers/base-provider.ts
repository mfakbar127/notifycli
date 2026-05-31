/**
 * Base provider interface and common functionality
 */

import type { Profile, Provider, NotificationResult } from "../types.js";
import { request, HttpError, NetworkError, TimeoutError } from "../http/client.js";

export abstract class BaseProvider implements Provider {
  abstract readonly name: string;

  abstract send(message: string, profile: Profile): Promise<NotificationResult>;
  abstract test(profile: Profile): Promise<NotificationResult>;

  /**
   * Build a standardized success result
   */
  protected buildSuccess(
    profileName: string,
    message?: string,
  ): NotificationResult {
    return {
      success: true,
      provider: this.name,
      profileName,
      message,
    };
  }

  /**
   * Build a standardized error result
   */
  protected buildError(profileName: string, error: Error): NotificationResult {
    let errorMessage: string;

    if (error instanceof HttpError) {
      errorMessage = `HTTP error ${error.status}: ${error.statusText}`;
    } else if (error instanceof NetworkError) {
      errorMessage = `Network error: ${error.message}`;
    } else if (error instanceof TimeoutError) {
      errorMessage = `Timeout: ${error.message}`;
    } else {
      errorMessage = error.message;
    }

    return {
      success: false,
      provider: this.name,
      profileName,
      error: errorMessage,
    };
  }

  /**
   * Execute HTTP request with standardized error handling
   */
  protected async executeRequest(
    options: {
      url: string;
      body: unknown;
      headers?: Record<string, string>;
      timeout?: number;
    },
    profileName: string,
  ): Promise<NotificationResult> {
    try {
      await request({
        url: options.url,
        method: "POST",
        headers: options.headers,
        body: options.body,
        timeout: options.timeout ?? 30000,
      });

      return this.buildSuccess(profileName);
    } catch (error) {
      if (error instanceof Error) {
        return this.buildError(profileName, error);
      }
      return this.buildError(profileName, new Error("Unknown error"));
    }
  }
}
