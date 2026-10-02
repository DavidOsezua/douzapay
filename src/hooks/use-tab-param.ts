import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Keeps a tab selection in the URL (?key=value) so it survives a refresh.
// The fallback tab is kept out of the URL, and a missing or unknown value
// (checked against `allowed` when given) resolves to the fallback.
export const useTabParam = <T extends string>(
  key: string,
  fallback: T,
  allowed?: readonly T[],
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(key);
  const tab =
    raw && (!allowed || allowed.includes(raw as T)) ? (raw as T) : fallback;

  const setTab = useCallback(
    (next: T) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === fallback) params.delete(key);
          else params.set(key, next);
          return params;
        },
        { replace: true },
      );
    },
    [key, fallback, setSearchParams],
  );

  return [tab, setTab] as const;
};
