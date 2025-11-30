// src/services/api.js

// Detect production mode
// Vite sets `import.meta.env.MODE` to "development" or "production"
const isProd =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.MODE === "production") ||
  // fallback for safety
  window.location.hostname !== "localhost";

// 🔥 Base URL logic:
// In PRODUCTION → use same-origin "/api"
// In DEVELOPMENT → use backend URL "http://localhost:5000/api"
const API_BASE = (isProd ? "" : "http://localhost:5000") + "/api";

// Main request wrapper
async function API(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: "include", // required for cookie-based auth
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

/* -------------------------------
   AUTH / USER ENDPOINTS
--------------------------------*/

// Register
export const registerUser = (payload) =>
  API("/users/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Login
export const loginUser = (payload) =>
  API("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Get logged-in user
export const getMe = () => API("/users/me");

// Update profile
export const updateUser = (payload) =>
  API("/users/update", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Logout
export const logoutUser = () =>
  API("/users/logout", {
    method: "POST",
  });

// Delete account
export const deleteUser = () =>
  API("/users/delete", {
    method: "DELETE",
  });
