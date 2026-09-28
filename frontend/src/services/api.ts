import axios, { AxiosError } from "axios";
import { Platform } from "react-native";

/**
 * BASE_URL aponta para o backend Spring Boot.
 *
 * ATENÇÃO - dependendo de onde o app está rodando:
 * - Expo Web (navegador) → localhost funciona normalmente
 * - iOS Simulator        → localhost funciona normalmente
 * - Android Emulator     → use 10.0.2.2 no lugar de localhost
 * - Dispositivo físico   → use o IP da sua máquina (ex: 192.168.1.100)
 */
const hostPadrao = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${hostPadrao}:8080`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}
