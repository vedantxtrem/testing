import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      address, // 👈 address object
    } = await req.json();

    /* ---------------- VALIDATION ---------------- */

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      return NextResponse.json(
        { error: "Complete address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    /* ---------------- CHECK EXISTING USER ---------------- */

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    /* ---------------- HASH PASSWORD ---------------- */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------------- CREATE USER ---------------- */

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      addresses: [
        {
          fullName: address.fullName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || "",
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country || "India",
          isDefault: true, // first address default
        },
      ],
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}