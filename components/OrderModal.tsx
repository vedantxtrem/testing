"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";

export default function OrderModal({
  product,
  onClose,
}: any) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Get default address properly
  const defaultAddress = useMemo(() => {
    if (!session?.user?.addresses?.length) return null;

    return (
      session.user.addresses.find((a: any) => a.isDefault) ||
      session.user.addresses[0]
    );
  }, [session]);

  const handleSubmit = async () => {
    if (!defaultAddress) {
      alert("Please add an address first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderItems: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0],
          },
        ],
        shippingAddress: defaultAddress, // ✅ send full address object
        paymentMethod: "COD",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Order Placed Successfully 🎉");
      onClose();
    } else {
      alert(data.message || "Order failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black">
      <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">
        <h2 className="text-xl font-bold">Confirm Order</h2>

        <div className="border-b pb-3">
          <p className="font-semibold">{product.name}</p>
          <p>₹{product.price}</p>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        {/* SHIPPING INFO */}
        <div className="bg-gray-100 p-3 rounded text-sm">
          <p className="font-semibold mb-1">
            Shipping Address
          </p>

          {defaultAddress ? (
            <>
              <p>{defaultAddress.fullName}</p>
              <p>{defaultAddress.phone}</p>
              <p>{defaultAddress.addressLine1}</p>
              {defaultAddress.addressLine2 && (
                <p>{defaultAddress.addressLine2}</p>
              )}
              <p>
                {defaultAddress.city},{" "}
                {defaultAddress.state} -{" "}
                {defaultAddress.pincode}
              </p>
              <p>{defaultAddress.country}</p>
            </>
          ) : (
            <p className="text-red-500">
              No address found
            </p>
          )}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>₹{product.price * quantity}</span>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            {loading ? "Placing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}