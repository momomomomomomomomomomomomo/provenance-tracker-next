import "next-auth";
import "next-auth/jwt";
import Providers from "@/components/Providers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      backendToken: string;
      isApproved: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    token: string;
    isApproved: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    roles: string[];
    backendToken: string;
    isApproved: boolean;
  }
}