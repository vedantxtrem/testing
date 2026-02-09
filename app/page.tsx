import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="max-w-xl text-center">
        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
          Product CRUD Dashboard
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-gray-600">
          Manage your products with a fast, modern Next.js & MongoDB app.
        </p>

        {/* CTA */}
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
        >
          Go to Products →
        </Link>

        {/* Footer note */}
        <p className="mt-6 text-sm text-gray-500">
          Built with Next.js, MongoDB & Tailwind CSS
        </p>
      </div>
    </main>
  );
}