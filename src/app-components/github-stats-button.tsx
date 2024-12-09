"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { UserData, GithubLanguage } from "@/types/user";

interface GithubStatsButtonProps {
    userData: UserData | null;
}

const GithubStatsButton: React.FC<GithubStatsButtonProps> = ({ userData }) => {
    const [stats, setStats] = useState<GithubLanguage[] | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const fetchGithubStats = async () => {
        if (!userData?.username) return;

        try {
            setLoadingStats(true);
            const response = await axios.get(
                `/api/github/user/${userData.username}`
            );
            setStats(response.data.languages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingStats(false);
        }
    };

    return (
        <div>
            <Button onClick={fetchGithubStats} disabled={loadingStats}>
                {loadingStats ? "Loading..." : "Get My GitHub Stats"}
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
