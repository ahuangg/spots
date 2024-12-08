import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            username: string;
        } & DefaultSession["user"];
    }
    interface User {
        username: string;
    }
}

const handler = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    username: profile.login,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            if (session.user) {
                session.user.username = token.username as string;
            }
            return session;
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.username = user.username;
            }
            return token;
        },
    },
    pages: {
        error: "/error",
    },
});

export { handler as GET, handler as POST };
