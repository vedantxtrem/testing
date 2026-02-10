import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/order";

/* ---------------- GET ---------------- */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ MUST unwrap

    await connectDB();

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ user: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ user, orders });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ---------------- PUT ---------------- */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ THIS IS THE FIX
    const { name, role } = await req.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      id,
      { name, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}