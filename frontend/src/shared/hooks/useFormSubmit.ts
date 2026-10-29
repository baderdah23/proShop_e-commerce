"use client";

import { useRef, useState } from "react";
import { toast } from "@/shared/components/Toast";

export interface UseFormSubmitOptions {
  /** Toast shown after a successful submission. Omitted → no success toast. */
  successMessage?: string;
  /** Used when the thrown value is not an `Error` with a usable message. */
  fallbackErrorMessage?: string;
}

export interface UseFormSubmitResult {
  /** True while the submitted request is in flight. */
  isSubmitting: boolean;
  /** Last failed request's message, for inline display in the form. */
  error: string | null;
  /**
   * Runs `request` with centralized loading/error handling and resolves to its
   * result, or `undefined` when it fails (or is ignored as a duplicate submit).
   */
  submit: <TData>(request: () => Promise<TData>) => Promise<TData | undefined>;
}

const DEFAULT_ERROR_MESSAGE = "تعذر إتمام العملية، حاول مرة أخرى";

/**
 * Centralizes the loading, error and toast handling for a submitted request so
 * forms do not repeat `try/catch/finally` and `toast.error` in every component.
 *
 * `clientFetch` already normalizes HTTP failures into an `Error` carrying the
 * backend message, so this hook only supplies the shared UI behavior: one
 * in-flight request at a time, `isSubmitting` reset in `finally`, the error
 * message kept for inline rendering, and a single toast per failure.
 *
 * Client-only: it is built on `clientFetch`'s client-side contract and must not
 * be used for server fetches (see `fetch-or-fallback` for that path).
 *
 * @param options - Optional success toast copy and generic failure copy.
 * @returns `{ isSubmitting, error, submit }`.
 *
 * @example
 * const { isSubmitting, error, submit } = useFormSubmit({
 *   successMessage: "تم إنشاء الحساب بنجاح",
 * });
 *
 * await submit(() => clientFetch("auth/signup", { method: "POST", ... }));
 */
export function useFormSubmit({
  successMessage,
  fallbackErrorMessage = DEFAULT_ERROR_MESSAGE,
}: UseFormSubmitOptions = {}): UseFormSubmitResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State updates are asynchronous, so a second click in the same tick would
  // still see `isSubmitting === false`; the ref is the real duplicate guard.
  const isRequestInFlight = useRef(false);

  async function submit<TData>(
    request: () => Promise<TData>,
  ): Promise<TData | undefined> {
    if (isRequestInFlight.current) {
      return undefined;
    }

    isRequestInFlight.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await request();

      if (successMessage) {
        toast.success(successMessage);
      }

      return data;
    } catch (caught) {
      const message =
        caught instanceof Error && caught.message
          ? caught.message
          : fallbackErrorMessage;

      setError(message);
      toast.error(message);

      return undefined;
    } finally {
      isRequestInFlight.current = false;
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, error, submit };
}
