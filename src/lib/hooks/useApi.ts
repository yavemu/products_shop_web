"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient, ApiOptions } from "@/lib/api/apiClient";

export function useApi<T>(endpoint: string, options?: ApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient<T>(endpoint, options);
      setData(result);
    } catch (err: any) {
      console.error("useApi Error:", err);
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, retry };
}
