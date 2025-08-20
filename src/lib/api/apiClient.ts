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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : '';
    const errorCode = (error as Error & { code?: string })?.code;
    
    if (errorName === 'TypeError' && errorMessage === 'fetch failed') {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servicio esté disponible.");
    }
    
    if (errorCode === 'ECONNREFUSED' || errorMessage.includes('ECONNREFUSED')) {
      throw new Error("El servidor no está disponible en este momento. Intenta nuevamente más tarde.");
    }
    
    if (errorCode === 'ENOTFOUND' || errorMessage.includes('ENOTFOUND')) {
      throw new Error("No se pudo encontrar el servidor. Verifica la configuración de la aplicación.");
    }
    
    if (errorName === 'AbortError') {
      throw new Error("La petición ha sido cancelada debido a timeout.");
    }
    
    if (errorMessage.includes('Network request failed')) {
      throw new Error("Error de red. Verifica tu conexión a internet.");
    }
    
    if (error instanceof Error && !errorMessage.includes("fetch failed")) {
      throw error;
    }

    throw new Error("Ocurrió un error inesperado. Intenta nuevamente.");
  }
}
