import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form className="bg-blue-200 rounded-sm" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        placeholder="Pesquisar filmes..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=""
        aria-label="Pesquisar filmes"
      />
      <button type="submit" className="" aria-label="Buscar">
        🔍
      </button>
    </form>
  );
}