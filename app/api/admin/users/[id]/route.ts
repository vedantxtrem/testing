import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/order"; // ✅ FIXED CASE

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

    const { id } = await params;

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

    const { id } = await params;
    const { name, role } = await req.json();

    await connectDB();

    // 🚫 Prevent demoting last admin
    if (role === "user") {
      const adminCount = await User.countDocuments({ role: "admin" });
      const currentUser = await User.findById(id);

      if (currentUser?.role === "admin" && adminCount === 1) {
        return NextResponse.json(
          { message: "Cannot demote the last admin" },
          { status: 400 }
        );
      }
    }

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

/* ---------------- DELETE ---------------- */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    // ❌ Prevent self delete
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // ❌ Prevent deleting last admin
    const user = await User.findById(id);
    if (user?.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}