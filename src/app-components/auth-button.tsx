"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/button";

const AuthButton = () => {
    const { data: session, status } = useSession();

    if (status === "loading") return null;

    return session?.user ? (
        <Button onClick={() => signOut()}>
            Sign out {session.user.username}
        </Button>
    ) : (
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
    );
};

export default AuthButton;
