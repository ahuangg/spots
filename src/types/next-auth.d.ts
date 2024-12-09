import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        user?: {
            username?: string;
            githubId?: number;
        } & DefaultSession["user"];
    }
}
