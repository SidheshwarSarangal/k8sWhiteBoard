// Base URL for API and Socket.IO (same origin when behind Ingress). Set at build time via VITE_API_URL.
const baseUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';

export const API_BASE = baseUrl;
export const SOCKET_URL = baseUrl || window.location.origin;
