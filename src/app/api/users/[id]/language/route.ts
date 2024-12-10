import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);
        const resolvedParams = await params;

        if (!session?.user?.githubId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = parseInt(resolvedParams.id, 10);

        if (isNaN(userId) || session.user.githubId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { languageStats } = await request.json();

        const updatedLanguageStats = languageStats
            .map((lang: { language: string; percentage: string }) => ({
                language: lang.language,
                percentage: lang.percentage,
            }))
            .filter(
                (lang: { language: string; percentage: string }) =>
                    lang.language && lang.percentage
            );

        await prisma.user.update({
            where: { id: userId },
            data: { languageStats: updatedLanguageStats },
        });

        return NextResponse.json({
            message: "User language stats updated successfully.",
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
