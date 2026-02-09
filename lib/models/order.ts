import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    // 🔗 User reference
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🛒 Ordered items
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // optional (only if you have product model)
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    // 💰 Payment
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD", "NETBANKING"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // 📦 Order lifecycle
    status: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    // 🏠 Delivery info
    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    // 🧾 Tracking (optional)
    trackingId: String,
    courier: String,
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default models.Order || model("Order", OrderSchema);