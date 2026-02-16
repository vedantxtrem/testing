import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true }, // snapshot
    price: { type: Number, required: true }, // snapshot
    quantity: { type: Number, required: true, min: 1 },

    image: String, // snapshot
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [OrderItemSchema],

    shippingAddress: ShippingAddressSchema,

    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["UPI", "COD"], // ✅ Only these
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },

    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);