import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🛍 Our Products</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}