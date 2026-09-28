import "next-auth";

declare module "next-auth" {
  interface User {
    apiToken: string;
  }

  interface Session {
    apiToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken: string;
    id: string;
  }
}