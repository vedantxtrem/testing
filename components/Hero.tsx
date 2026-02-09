import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-yellow-50 to-white overflow-hidden pt-10">
      <div className="max-w-7xl mx-auto px-4 py-10  md:py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-semibold">
            100% Pure • Raw • Natural
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Pure Natural Honey <br />
            <span className="text-yellow-500">Straight From the Hive</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Experience the richness of unprocessed, chemical-free honey sourced
            directly from trusted beekeepers. Taste nature’s sweetness.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="#order"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
            >
              Order Now 🍯
            </Link>

            <Link
              href="#products"
              className="border border-yellow-400 text-yellow-700 px-6 py-3 rounded-full font-semibold hover:bg-yellow-50 transition"
            >
              View Products
            </Link>
          </div>

          {/* TRUST BADGES */}
          <div className="flex gap-6 pt-6 text-sm text-gray-500">
            <div>🐝 Raw Honey</div>
            <div>🌿 No Chemicals</div>
            <div>🚚 Fast Delivery</div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-40" />

          <Image
            src="https://images.pexels.com/photos/6561763/pexels-photo-6561763.jpeg"
            alt="Pure Honey"
            width={500}
            height={400}
            className="relative rounded-3xl shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
