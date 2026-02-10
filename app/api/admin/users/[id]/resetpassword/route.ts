import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ FIX

    await connectDB();

    const hashed = await bcrypt.hash("madhuras@123", 10);

    await User.findByIdAndUpdate(id, {
      password: hashed,
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}