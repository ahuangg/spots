"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/button";

const AuthButton = () => {
    const { data: session } = useSession();

    if (session?.user) {
        return (
            <Button onClick={() => signOut()}>
                Sign out {session.user.username}
            </Button>
        );
    }
    return (
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
    );
};

export default AuthButton;
