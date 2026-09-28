// src/api/auth.ts
import api from "./client";
import type { AuthResponse, User } from "../../types";

interface SignupPayload {
  fullName?: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse }>("/auth/signup", payload);
  return data.data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<{ data: User }>("/account/profile");
  return data.data;
}