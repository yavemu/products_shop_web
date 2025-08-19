"use client";

import { useEffect, useState } from "react";
import { apiClient, ApiOptions } from "@/lib/api/apiClient";

export function useApi<T>(endpoint: string, options?: ApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiClient<T>(endpoint, options);
        if (isMounted) setData(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (isMounted) setError(err.message || "Error desconocido");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}
