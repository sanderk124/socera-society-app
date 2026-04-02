import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "openid profile email" } },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        return token;
      }

      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      try {
        const response = await fetch(
          `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.KEYCLOAK_CLIENT_ID!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          }
        );

        const refreshed = await response.json();

        if (!response.ok) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Token refresh failed:', refreshed.error, refreshed.error_description);
            console.log('Token expiry was:', new Date((token.expiresAt as number) * 1000));
            console.log('User will be logged out.');
          }
          return { ...token, error: "RefreshTokenError" };
        }

        token.accessToken = refreshed.access_token;
        token.idToken = refreshed.id_token;
        token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
        token.expiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;

        return token;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Unexpected error during token refresh:', error);
        }
        return { ...token, error: "RefreshTokenError" };
      }
    },
    
    async session({ session, token }) {
      if (token?.error === "RefreshTokenError") {
        return null as any;
      }

      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;

      return session;
    },
    
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return baseUrl;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
  
  events: {
    async signOut({ token }) {
      if (token?.idToken) {
        const logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
        const params = new URLSearchParams({
          id_token_hint: token.idToken as string,
          post_logout_redirect_uri: process.env.NEXTAUTH_URL || "http://localhost:3000",
        });
        
        try {
          await fetch(`${logoutUrl}?${params}`, { method: "GET" });
        } catch (error) {
          console.error("Keycloak logout error:", error);
        }
      }
    },
  },
};

export async function getSession() {
  return await getServerSession(authOptions);
}