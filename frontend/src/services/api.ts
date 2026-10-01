import axios, { AxiosError } from "axios";

/**
 * BASE_URL aponta para o backend Spring Boot.
 *
 * O padrão é o serviço publicado no Render pessoal.
 * Para desenvolvimento local, defina EXPO_PUBLIC_API_URL em .env.local
 * (localhost no navegador, 10.0.2.2 no emulador Android ou IP do PC no celular).
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ??
  "https://backend-consultas-joao-baldini-hxip.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}
