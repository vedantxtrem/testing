"use client";


import { useEffect, useState } from "react";


export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", price: "", description: "" });


    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        setProducts(await res.json());
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    const addProduct = async () => {
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                price: Number(form.price),
                description: form.description,
            }),
        });
        setForm({ name: "", price: "", description: "" });
        fetchProducts();
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
        <div style={{ padding: 30 }}>
            <h2>Add Product</h2>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button onClick={addProduct}>Add</button>


            <hr />


            <h2>Products</h2>
            {products.map(p => (
                <div key={p._id} style={{ marginBottom: 10 }}>
                    <b>{p.name}</b> – ₹{p.price}
                    <button onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}