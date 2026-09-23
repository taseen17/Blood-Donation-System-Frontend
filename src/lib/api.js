export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://blood-donation-system-backend-1v44.onrender.com";

export async function apiRequest(path, options = {}) {
    const token = options.token ?? localStorage.getItem("access_token");
    const headers = new Headers(options.headers || {});

    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { detail: text };
    }

    if (response.status === 401) {
        window.dispatchEvent(new Event("auth-expired"));
    }
    if (!response.ok) {
        const detail = data?.detail || data?.message || "Something went wrong. Please try again.";
        throw new Error(detail);
    }
    return data;
}

export function jsonBody(value) {
    return JSON.stringify(value);
}
