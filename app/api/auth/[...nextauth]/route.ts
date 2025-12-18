import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

interface DotNetUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  token: string;
  isApproved: boolean;
}

const DOTNET_API_URL = process.env.NEXT_PUBLIC_DOTNET_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const res = await fetch(`${DOTNET_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const user = (await res.json()) as DotNetUser;

        console.log("Authorize Callback (Credentials) - User from API:", user);

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      
      if (account && user) {
        let dotNetUser: DotNetUser | null = null;

        if (account.provider === "credentials") {
          dotNetUser = user as DotNetUser;
        } 
        else if (account.provider === "google" || account.provider === "github") {
          try {
            const res = await fetch(`${DOTNET_API_URL}/api/auth/external-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                username: user.name || user.email,
                role: "User"
              }),
            });

            if (res.ok) {
              dotNetUser = (await res.json()) as DotNetUser;
              console.log("JWT Callback (OAuth) - User from API:", dotNetUser);
            } else {
              const errorText = await res.text();
              console.error(`[AUTH] /api/auth/external-login failed with ${res.status}:`, errorText);
              throw new Error(`Failed to sign in. Backend returned ${res.status}`);
            }
          } catch (error) {
            console.error("[AUTH] Error in external-login JWT callback:", error);
            throw new Error("Failed to complete sign-in with .NET backend.");
          }
        }

        if (dotNetUser) {
          console.log("JWT Callback: Mapping dotNetUser to token:", dotNetUser);
          token.userId = dotNetUser.id;
          token.roles = dotNetUser.roles;
          token.backendToken = dotNetUser.token;
          token.email = dotNetUser.email;
          token.name = dotNetUser.username;
          token.isApproved = dotNetUser.isApproved;
        }
      }
      
      if (trigger === "update" && session?.user) {
        console.log("JWT CALLBACK: UPDATE TRIGGERED");
        console.log("JWT CALLBACK: Merging new data from client:", session.user);

        token.roles = session.user.roles;
        token.isApproved = session.user.isApproved;
        token.name = session.user.name;
        token.email = session.user.email;
      }
      
      console.log("JWT Callback - Returning Token:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("Session Callback - Token Received:", token);

      if (session.user) {
        session.user.id = token.userId as string;
        session.user.roles = token.roles as string[];
        session.user.backendToken = token.backendToken as string;
        session.user.isApproved = token.isApproved as boolean;
        
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      console.log("Session Callback - Returning Session:", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };