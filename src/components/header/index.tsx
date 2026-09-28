"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import SearchBar from "../searchbar";
import ProfileMenu from "../profilemenu";
import logo from "../../assets/logo.png"; // ajuste para o caminho/nome real do seu arquivo

export default function Header() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  function linkClasses(href: string, exact = false) {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `text-sm whitespace-nowrap ${
      isActive ? "font-semibold text-white" : "text-gray-300 hover:text-white"
    }`;
  }

  return (
    <header className="flex items-center gap-6 border-b border-[#2e2e30] bg-surface px-6 py-3">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <Image src={logo} alt="Film{IN}hos" width={32} height={32} />
        <span className="rounded-md bg-brand px-3 py-1.5 text-sm font-bold text-white hover:opacity-90">
          Film{"{"}IN{"}"}hos
        </span>
      </Link>

      <nav className="flex flex-1 gap-4">
        <Link href="/" className={linkClasses("/", true)}>
          Home
        </Link>
        <Link href="/search" className={linkClasses("/search")}>
          Pesquisa
        </Link>
      </nav>

      <SearchBar />

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <>
            <Link href="/login" className={linkClasses("/login")}>
              Entrar
            </Link>
            <Link href="/signup" className={linkClasses("/signup")}>
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}