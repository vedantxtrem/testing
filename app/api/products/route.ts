import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";


// CREATE PRODUCT
export async function POST(req: Request) {
await connectDB();
const body = await req.json();
const product = await Product.create(body);
return NextResponse.json(product);
}


// READ PRODUCTS
export async function GET() {
await connectDB();
const products = await Product.find().sort({ createdAt: -1 });
return NextResponse.json(products);
}


// UPDATE PRODUCT
export async function PUT(req: Request) {
await connectDB();
const { id, ...data } = await req.json();
const updated = await Product.findByIdAndUpdate(id, data, { new: true });
return NextResponse.json(updated);
}


// DELETE PRODUCT
export async function DELETE(req: Request) {
await connectDB();
const { id } = await req.json();
await Product.findByIdAndDelete(id);
return NextResponse.json({ success: true });
}