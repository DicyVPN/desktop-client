export function getCurrentServer() {
  return JSON.parse(localStorage.getItem("currentServer") || "{}");
}