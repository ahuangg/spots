"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface GithubLanguage {
    language: string;
    percentage: string;
}

const GithubStatsButton = () => {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<GithubLanguage[] | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchGithubStats = async () => {
        if (!session?.user?.username) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `/api/github/user/${session.user.username}`
            );
            setStats(response.data.languages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return null;
    if (!session) return null;

    return (
        <div>
            <Button onClick={fetchGithubStats} disabled={loading}>
                {loading ? "Loading..." : "Get My GitHub Stats"}
            </Button>
            <div className="flex flex-col">
                {stats && stats.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-bold">
                            Top Language: {stats[0].language}
                        </h3>
                        <div className="space-y-1">
                            {stats.map((lang) => (
                                <div
                                    key={lang.language}
                                    className="flex justify-between"
                                >
                                    <span>{lang.language}</span>
                                    <span>{lang.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GithubStatsButton;
