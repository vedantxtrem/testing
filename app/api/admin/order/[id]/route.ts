import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";
import Product from "@/lib/models/Product";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const order = await Order.findById(params.id);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  // Update order status
  if (body.orderStatus) {
    order.orderStatus = body.orderStatus;
    if (body.orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }
  }

  // Update payment status
  if (body.paymentStatus) {
    order.paymentStatus = body.paymentStatus;
    if (body.paymentStatus === "paid") {
      order.paidAt = new Date();
    }
  }

  // Update quantity (Admin can modify)
  if (body.orderItems) {
    order.orderItems = body.orderItems;

    // recalc total
    order.totalAmount = body.orderItems.reduce(
      (acc: number, item: any) =>
        acc + item.price * item.quantity,
      0
    );
  }

  await order.save();

  return NextResponse.json({ message: "Order updated", order });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  await Order.findByIdAndDelete(params.id);

  return NextResponse.json({ message: "Order deleted" });
}