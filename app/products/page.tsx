"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitProduct = async () => {
    if (!form.name || !form.price) return;

    setLoading(true);

    await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId
          ? { id: editingId, ...form, price: Number(form.price) }
          : { ...form, price: Number(form.price) }
      ),
    });

    setForm({ name: "", price: "", description: "" });
    setEditingId(null);
    setLoading(false);
    fetchProducts();
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", price: "", description: "" });
  };

  const deleteProduct = async (id: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Product Management
        </h1>

        {/* Add / Edit Product Card */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-3 text-black">
            <input
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Product name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={submitProduct}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                onClick={cancelEdit}
                className="rounded-lg border px-6 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Products
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {p.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{p.price}
                      {p.description && ` • ${p.description}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-lg bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}