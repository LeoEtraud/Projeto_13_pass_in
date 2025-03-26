import { api } from "../../services/api";

export async function LoginRequest(email: string, password: string) {
  try {
    const request = await api.post("/auth", { email, password });
    return request.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function RefreshToken(token: string) {
  try {
    const request = await api.post("/refresh-token-auth", {
      refreshToken: token,
    });
    return request.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
