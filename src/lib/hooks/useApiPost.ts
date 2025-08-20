"use client";

import { useState, useCallback } from "react";
import { apiClient, ApiOptions } from "@/lib/api/apiClient";

export interface UseApiPostResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (endpoint: string, options?: ApiOptions) => Promise<T>;
  reset: () => void;
}

export function useApiPost<T>(): UseApiPostResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (endpoint: string, options?: ApiOptions): Promise<T> => {
    setLoading(true);
    setError(null);

    console.log("Endpoint:", endpoint);
    console.log("Options:", options);

    try {
      const result = await apiClient<T>(endpoint, options);
      setData(result);
      console.log("Result:", result);
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error inesperado";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
