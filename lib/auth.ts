import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.isActive) {
          throw new Error("Account disabled");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.addresses = user.addresses;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" || "user";
        session.user.addresses = token.addresses as any[];
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};