import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    let totalAmount = 0;

    // Reduce stock & calculate total
    for (const item of body.orderItems) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += item.price * item.quantity;
    }

    const order = await Order.create({
      user: session.user.id,
      orderItems: body.orderItems,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      totalAmount,
    });

    return NextResponse.json({ message: "Order placed", order });
  } catch (error) {
    return NextResponse.json({ message: "Order failed" }, { status: 500 });
  }
}

