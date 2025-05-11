export async function refreshAuth(refreshToken) {
  try {
    const res = await fetch("http://4.237.58.241:3000/user/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error("Refresh failed");
    }

    const data = await res.json();

    // Save the new tokens 
    return {
      newJwt: data.bearerToken.token,
      newRefresh: data.refreshToken.token,
    };
  } catch (err) {
    console.error("Error refreshing token:", err);
    throw err;
  }
}