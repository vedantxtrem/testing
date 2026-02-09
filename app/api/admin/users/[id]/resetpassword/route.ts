import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(_: Request, { params }: any) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const hashed = await bcrypt.hash("madhuras@123", 10);

  await User.findByIdAndUpdate(params.id, {
    password: hashed,
  });

  return NextResponse.json({ success: true });
}