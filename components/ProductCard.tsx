"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrderModal from "./OrderModal";

export default function ProductCard({ product }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOrderClick = () => {
    if (!session) {
      router.push("/login");
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <img
        src={product.images[0]}
        className="h-48 w-full object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-4">
        {product.name}
      </h2>

      <p className="text-gray-500 text-sm">
        {product.description}
      </p>

      <p className="mt-2 font-bold text-xl">
        ₹{product.price}
      </p>

      <button
        onClick={handleOrderClick}
        className="mt-4 w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
      >
        Order Now
      </button>

      {open && (
        <OrderModal
          product={product}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}