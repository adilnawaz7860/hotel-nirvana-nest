export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
  error?: { code: string; message: string; fields?: Record<string, string[]> };
};

export class ApiClientError extends Error {
  code: string;
  fields?: Record<string, string[]>;

  constructor(message: string, code: string, fields?: Record<string, string[]>) {
    super(message);
    this.code = code;
    this.fields = fields;
  }
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success) {
    throw new ApiClientError(
      json.error?.message ?? "Something went wrong",
      json.error?.code ?? "UNKNOWN_ERROR",
      json.error?.fields
    );
  }
  return json;
}
