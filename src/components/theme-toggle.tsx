"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
                        style={{ position: "relative" }}
                    >
                        <Sun
                            style={{
                                height: "22px",
                                width: "22px",
                                transform:
                                    theme === "dark"
                                        ? "rotate(-90deg) scale(0)"
                                        : "rotate(0) scale(1)",
                                transition: "all 0.3s",
                            }}
                        />
                        <Moon
                            style={{
                                position: "absolute",
                                height: "22px",
                                width: "22px",
                                transform:
                                    theme === "dark"
                                        ? "rotate(0) scale(1)"
                                        : "rotate(90deg) scale(0)",
                                transition: "all 0.3s",
                            }}
                        />
                        <span className="sr-only">Toggle Theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Toggle Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
