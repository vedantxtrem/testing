import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import slugify from "slugify";

/* CREATE */
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const slug = slugify(body.name, { lower: true });

  const product = await Product.create({
    ...body,
    slug,
  });

  return NextResponse.json(product);
}

/* READ */
export async function GET() {
  await connectDB();
  const products = await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });
  return NextResponse.json(products);
}

/* UPDATE */
export async function PUT(req: Request) {
  await connectDB();
  const { id, ...data } = await req.json();

  if (data.name) {
    data.slug = slugify(data.name, { lower: true });
  }

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updated);
}

/* DELETE */
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}