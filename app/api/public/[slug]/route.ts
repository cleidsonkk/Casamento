import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: {
      wedding: { include: { sections: true, template: true } },
      pixSetting: true,
    },
  });
  if (!couple?.wedding?.published) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: couple.id,
    slug: couple.slug,
    name: couple.name,
    wedding: couple.wedding,
    sections: couple.wedding.sections,
    tokens: couple.wedding.template?.tokensJson ?? {},
    layout: couple.wedding.template?.layoutJson ?? {},
    pixEnabled: couple.pixSetting?.enabled ?? false,
  });
}

