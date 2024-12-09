import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const languageSchema = z.object({
    language: z.string(),
    percentage: z.string(),
});

const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    languageStats: z.array(languageSchema),
    h3Index: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export async function GET(
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

        let user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    username: session.user.username || "",
                    languageStats: [],
                },
            });
        }

        const validatedUser = userSchema.parse(user);
        return NextResponse.json(validatedUser);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
