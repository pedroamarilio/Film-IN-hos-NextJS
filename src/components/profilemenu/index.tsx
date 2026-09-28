"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getAvatarUrl } from "../../app/api/utils/avatar";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogout() {
    closeMenu();
    await signOut({ redirect: false });
    router.push("/login");
  }

  if (!session?.user) return null;

  const userId = session.user.id;
  const userName = session.user.name;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu do perfil"
        aria-expanded={open}
        className="flex items-center"
      >
        <img
          src={getAvatarUrl({ id: Number(userId), avatarUrl: null })}
          alt={userName ?? ""}
          className="h-8.5 w-8.5 rounded-full border border-border object-cover"
        />
      </button>

      {open && (
        <ul className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-45 rounded-lg border border-border bg-surface p-1 shadow-lg">
          <li>
            <Link
              href={`/users/${userId}`}
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm text-white hover:bg-surfaceHover"
            >
              Meu perfil
            </Link>
          </li>
          <li>
            <Link
              href="/favorites"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm text-white hover:bg-surfaceHover"
            >
              Favoritos
            </Link>
          </li>
          <li>
            <Link
              href="/watched"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm text-white hover:bg-surfaceHover"
            >
              Assistidos
            </Link>
          </li>
          <li>
            <Link
              href="/myreviews"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm text-white hover:bg-surfaceHover"
            >
              Reviews
            </Link>
          </li>
          <li className="my-1 h-px bg-border" />
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20"
            >
              Sair
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}