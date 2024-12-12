"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, LogIn, CircleUser } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AuthButton = () => {
    const { data: session, status } = useSession();

    if (status === "loading") return null;

    if (session?.user) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => signOut()}
                            className="relative overflow-hidden group"
                        >
                            <div className="relative transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
                                <Avatar>
                                    <AvatarImage
                                        src={`https://github.com/${session?.user?.username}.png`}
                                        alt={`@${session?.user?.username}`}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0">
                                <LogOut
                                    style={{
                                        height: "22px",
                                        width: "22px",
                                    }}
                                />
                            </div>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sign Out</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => signIn("github")}
                        className="relative overflow-hidden group"
                    >
                        <div className="relative transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full flex items-center justify-center">
                            <div
                                className="rounded-full flex items-center justify-center"
                                style={{ height: "40px", width: "40px" }}
                            >
                                <CircleUser
                                    style={{
                                        height: "22px",
                                        width: "22px",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0">
                            <LogIn
                                style={{
                                    height: "22px",
                                    width: "22px",
                                }}
                            />
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Sign In with GitHub</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default AuthButton;
