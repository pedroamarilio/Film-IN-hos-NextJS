"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import * as authApi from "../api/auth";
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
  field?: string;
}

export default function Signup() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await authApi.signup({ fullName, email, password, passwordConfirmation });
      router.push("/login?registered=true");
    } catch (err) {
      const axiosErr = err as AxiosError<{ errors: ApiError[] }>;
      setErrors(axiosErr.response?.data?.errors ?? [{ message: "Erro ao cadastrar." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-white">Criar conta</h1>

      {errors.length > 0 && (
        <ul className="mb-4 flex flex-col gap-1 rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-400">
          {errors.map((error, i) => (
            <li key={i}>{error.message}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Nome
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-white outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-white outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={32}
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-white outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Confirmar senha
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-white outline-none focus:border-brand"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-brand py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Já tem conta?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}