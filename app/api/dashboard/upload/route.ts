import { NextResponse } from "next/server";
import { requireCoupleContext } from "@/lib/currentUser";
import { uploadImage } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    await requireCoupleContext();
    const body = await req.json();
    const dataUri = body.dataUri as string;
    if (!dataUri) return NextResponse.json({ error: "dataUri obrigatório" }, { status: 400 });
    const uploaded = await uploadImage(dataUri);
    return NextResponse.json({ url: uploaded.secure_url });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

