import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { token, user } = data.data;

        
          return { id: String(user.id), name: user.fullName, email: user.email, apiToken: token };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.apiToken = user.apiToken;
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    session.apiToken = token.apiToken;
    if (session.user) session.user.id = token.id;
    return session;
  },
},
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };