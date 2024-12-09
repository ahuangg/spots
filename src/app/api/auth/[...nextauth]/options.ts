import GitHub from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    scope: "read:user repo",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile) return false;

            try {
                const githubId = (profile as { id: number }).id;
                const username = (profile as { login: string }).login;

                await prisma.user.upsert({
                    where: { id: githubId },
                    update: {
                        username: username,
                    },
                    create: {
                        id: githubId,
                        username: username,
                        languageStats: [],
                    },
                });
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
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
