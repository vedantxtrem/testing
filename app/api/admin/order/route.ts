import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.formData();

  const status = body.get("status");
  const paymentStatus = body.get("paymentStatus");

  const updated = await Order.findByIdAndUpdate(
    params.id,
    {
      status,
      paymentStatus,
    },
    { new: true }
  );

  return NextResponse.redirect(
    new URL("/admin/orders", req.url)
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  await Order.findByIdAndDelete(params.id);

  return NextResponse.redirect(
    new URL("/admin/orders", req.url)
  );
}