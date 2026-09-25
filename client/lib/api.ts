const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";

  const responseText = await response.text();

  let data: any;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Invalid JSON response from ${endpoint}`
      );
    }
  } else {
    console.error(
      `Non-JSON response from ${endpoint}:`,
      responseText.slice(0, 300)
    );

    throw new Error(
      `Server returned an invalid response for ${endpoint}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}