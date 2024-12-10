import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; h3Index: string }> }
): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);
        const resolvedParams = await params;
        console.log(resolvedParams);
        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = parseInt(resolvedParams.id, 10);
        const h3Index = resolvedParams.h3Index;

        await prisma.user.update({
            where: { id: userId },
            data: { h3Index },
        });

        return NextResponse.json({
            message: "User H3 index updated successfully.",
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
