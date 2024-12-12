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

        const { h3Index, language } = await request.json();

        if (!h3Index || !language) {
            return NextResponse.json(
                {
                    error: "Invalid payload. 'h3Index' and 'language' are required.",
                },
                { status: 400 }
            );
        }

        await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { h3Index: true, favoriteLanguage: true },
            });

            if (!user) {
                throw new Error("User not found");
            }

            const oldH3Index = user.h3Index;
            const oldFavoriteLanguage = user.favoriteLanguage;
            const isSameCell = oldH3Index === h3Index;

            await prisma.user.update({
                where: { id: userId },
                data: { h3Index, favoriteLanguage: language },
            });

            if (oldH3Index && oldFavoriteLanguage) {
                await prisma.h3CellLanguageStat.updateMany({
                    where: {
                        h3CellIndex: oldH3Index,
                        language: oldFavoriteLanguage,
                    },
                    data: {
                        count: {
                            decrement: 1,
                        },
                    },
                });

                const updatedStat = await prisma.h3CellLanguageStat.findUnique({
                    where: {
                        h3CellIndex_language: {
                            h3CellIndex: oldH3Index,
                            language: oldFavoriteLanguage,
                        },
                    },
                });

                if (updatedStat && updatedStat.count <= 0) {
                    await prisma.h3CellLanguageStat.delete({
                        where: {
                            id: updatedStat.id,
                        },
                    });
                }

                if (!isSameCell) {
                    await prisma.h3Cell.update({
                        where: { index: oldH3Index },
                        data: {
                            totalUsers: {
                                decrement: 1,
                            },
                        },
                    });
                }

                const oldCellStats = await prisma.h3CellLanguageStat.findMany({
                    where: { h3CellIndex: oldH3Index },
                });

                if (oldCellStats.length > 0) {
                    const dominantLanguage = oldCellStats.reduce(
                        (prev, current) =>
                            (prev.count || 0) > (current.count || 0)
                                ? prev
                                : current
                    );

                    await prisma.h3Cell.update({
                        where: { index: oldH3Index },
                        data: {
                            dominantLanguage: dominantLanguage.language,
                        },
                    });
                } else {
                    await prisma.h3Cell.delete({
                        where: { index: oldH3Index },
                    });
                }
            }

            if (h3Index && language) {
                let h3Cell = await prisma.h3Cell.findUnique({
                    where: { index: h3Index },
                });

                if (!h3Cell) {
                    h3Cell = await prisma.h3Cell.create({
                        data: {
                            index: h3Index,
                            totalUsers: 0,
                            dominantLanguage: null,
                            createdAt: new Date(),
                        },
                    });
                }

                const existingStat = await prisma.h3CellLanguageStat.findUnique(
                    {
                        where: {
                            h3CellIndex_language: {
                                h3CellIndex: h3Index,
                                language: language,
                            },
                        },
                    }
                );

                if (existingStat) {
                    await prisma.h3CellLanguageStat.update({
                        where: { id: existingStat.id },
                        data: {
                            count: {
                                increment: 1,
                            },
                        },
                    });
                } else {
                    await prisma.h3CellLanguageStat.create({
                        data: {
                            h3CellIndex: h3Index,
                            language: language,
                            count: 1,
                        },
                    });
                }

                if (!isSameCell) {
                    await prisma.h3Cell.update({
                        where: { index: h3Index },
                        data: {
                            totalUsers: {
                                increment: 1,
                            },
                        },
                    });
                }

                const newCellStats = await prisma.h3CellLanguageStat.findMany({
                    where: { h3CellIndex: h3Index },
                });

                const dominantLanguage = newCellStats.reduce((prev, current) =>
                    (prev.count || 0) > (current.count || 0) ? prev : current
                );

                await prisma.h3Cell.update({
                    where: { index: h3Index },
                    data: {
                        dominantLanguage: dominantLanguage.language,
                    },
                });
            }
        });
        return NextResponse.json({
            message: "User data updated successfully.",
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
