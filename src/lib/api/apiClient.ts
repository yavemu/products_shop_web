"use server";
export interface ApiOptions extends RequestInit {
  revalidate?: number;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}${endpoint}`;

  const { revalidate, ...fetchOptions } = options;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {}),
      },
      next: revalidate ? { revalidate } : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${res.statusText} - ${errorText || "Sin detalle"}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
}
