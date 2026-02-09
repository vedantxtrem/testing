import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/order";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 Auth check
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // 👤 Fetch user
    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 📦 Fetch orders
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      user,
      orders,
    });
  } catch (error) {
    console.error("ADMIN USER FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}