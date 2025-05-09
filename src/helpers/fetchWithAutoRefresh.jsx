import { refreshAuth } from "./refreshAuth";

export async function fetchWithAutoRefresh(url, options = {}) {
  let jwt = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refreshToken");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401 && refreshToken) {
    try {
      const { newJwt, newRefresh } = await refreshAuth(refreshToken);

      localStorage.setItem("token", newJwt);
      localStorage.setItem("refreshToken", newRefresh);

      // Retry original request with new JWT
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newJwt}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Could not refresh token:", err);
    }
  }

  return response;
}