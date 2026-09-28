"use client";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", { email, password, redirect: false });

      if (result?.error) {
        setError("Credenciais inválidas.");
        return;
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-white">Entrar</h1>

      {justRegistered && (
        <p className="mb-4 rounded-md bg-green-900/30 px-3 py-2 text-sm text-green-400">
          Conta criada com sucesso! Faça login para continuar.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-white outline-none focus:border-brand"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-brand py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="text-brand hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}