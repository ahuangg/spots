"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/button";
import { Github } from 'lucide-react';

const AuthButton = () => {
    const { data: session } = useSession();

    if (session) {
        return (
            <Button onClick={() => signOut()}>
                Sign out {session.user.username}
            </Button>
        );
    }
    return (
        <Button onClick={() => signIn("github")}>
            Sign in with GitHub
            <Github />
        </Button>
    );
};

export default AuthButton;
