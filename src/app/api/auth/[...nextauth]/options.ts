import GitHub from "next-auth/providers/github";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    scope: "public_repo",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.accessToken = account.access_token;
                token.username = (profile as { login: string }).login;
                token.githubId = (profile as { id: number }).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.accessToken = token.accessToken as string;
                session.user.username = token.username as string;
                session.user.githubId = token.githubId as number;
            }
            return session;
        },
    },
    pages: {
        error: "/error",
    },
};
