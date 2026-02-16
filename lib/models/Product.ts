import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },
    discountPrice: Number,

    stock: { type: Number, required: true, default: 0 },

    sku: { type: String }, // for inventory

    category: {
      type: String,
      enum: ["Raw Honey", "Organic Honey", "Flavored Honey", "Comb Honey"],
      default: "Raw Honey",
    },

    images: [
      {
        type: String, // image URL
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);