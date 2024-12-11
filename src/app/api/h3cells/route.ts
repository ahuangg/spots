import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const h3Cells = await prisma.h3Cell.findMany();

        return NextResponse.json(h3Cells);
    } catch (error) {
        console.error("Error fetching H3 cells:", error);
        return NextResponse.json(
            { error: "Failed to fetch H3 cells" },
            { status: 500 }
        );
    }
}
