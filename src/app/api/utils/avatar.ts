import type { User } from "../../../types";


export function getAvatarUrl(user: Pick<User, "id" | "avatarUrl">): string {
  if (user.avatarUrl) return user.avatarUrl;
  return `https://i.pravatar.cc/300?u=${user.id}`;
}