import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);
        const resolvedParams = await params;

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: repos } = await axios.get(
            `https://api.github.com/users/${resolvedParams.username}/repos?per_page=100&sort=updated`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        const languageBytes: Record<string, number> = {};

        await Promise.all(
            repos.map(async (repo: { languages_url: string }) => {
                const { data: languages } = await axios.get(
                    repo.languages_url,
                    {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                Object.entries(languages).forEach(([language, bytes]) => {
                    languageBytes[language] =
                        (languageBytes[language] || 0) + (bytes as number);
                });
            })
        );

        const totalBytes = Object.values(languageBytes).reduce(
            (acc, bytes) => acc + bytes,
            0
        );

        const languageStats = Object.entries(languageBytes)
            .map(([language, bytes]) => ({
                language,
                percentage: ((bytes / totalBytes) * 100).toFixed(2),
            }))
            .sort(
                (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)
            );

        return NextResponse.json({
            languages: languageStats,
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
