"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
  category: string;
  images: string[];
  isActive: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    category: "Raw Honey",
    isActive: true,
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitProduct = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      images,
    };

    await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { id: editingId, ...payload } : payload
      ),
    });

    resetForm();
    fetchProducts();
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setImages(product.images || []);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPrice: String(product.discountPrice || ""),
      stock: String(product.stock),
      sku: product.sku || "",
      category: product.category,
      isActive: product.isActive,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setImages([]);
    setImageInput("");
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      category: "Raw Honey",
      isActive: true,
    });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchProducts();
  };

  const addImage = () => {
    if (!imageInput) return;
    setImages([...images, imageInput]);
    setImageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">
        Product Management
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Product Name *"
            className="inputStyle"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="SKU"
            className="inputStyle"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Description"
          className="inputStyle h-24"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Price *"
            className="inputStyle"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Discount Price"
            className="inputStyle"
            value={form.discountPrice}
            onChange={(e) =>
              setForm({ ...form, discountPrice: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Stock *"
            className="inputStyle"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        {/* IMAGE URL INPUT */}
        <div className="flex gap-3">
          <input
            placeholder="Paste Image URL"
            className="inputStyle"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addImage}
            className="bg-blue-600 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                onClick={() =>
                  setImages(images.filter((_, index) => index !== i))
                }
                className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={submitProduct}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          {p.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>₹{p.price}</td>

                  <td>{p.stock}</td>

                  <td>
                    {p.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="text-right p-4 space-x-4">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .inputStyle {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 8px;
          width: 100%;
        }
        .inputStyle:focus {
          outline: none;
          border-color: #2563eb;
        }
      `}</style>
    </div>
  );
}