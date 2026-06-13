import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", credentials.email));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) return null;
          
          const userDoc = querySnapshot.docs[0];
          const user = userDoc.data();
          
          if (!user.hashedPassword) return null;
          
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );
          
          if (!isPasswordCorrect) return null;
          
          return {
            id: userDoc.id,
            email: user.email,
            name: user.displayName || user.username || "Scholar",
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
