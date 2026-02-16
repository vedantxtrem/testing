import NextAuth, { DefaultSession } from "next-auth";

export type AddressType = {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
      addresses: AddressType[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "user";
    addresses: AddressType[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
    addresses: AddressType[];
  }
}