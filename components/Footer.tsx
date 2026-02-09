"use client";

import Image from "next/image";
import Link from "next/link";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">

      {/* Honey gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200" />

      {/* Honeycomb texture */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#f59e0b_1px,transparent_0)] bg-[size:22px_22px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">

          {/* BRAND */}
          <div>
            <h2 className="font-harman text-3xl text-amber-900 mb-4">
              मधुRas
            </h2>
            <p
              className={`${nunito.className} text-amber-800 leading-relaxed`}
            >
              Pure. Raw. Natural.  
              Harvested responsibly from nature’s finest hives and delivered
              with love.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-amber-900 font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-amber-700">
              {["Home", "About", "Products", "Our Journey", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "")}`}
                      className="hover:text-amber-900 transition"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="text-amber-900 font-semibold mb-4">
              Our Honey
            </h3>
            <ul className="space-y-3 text-amber-700">
              <li>🍯 Raw Forest Honey</li>
              <li>🌼 Organic Wild Honey</li>
              <li>🐝 Unprocessed Honey</li>
              <li>🍯 Natural Comb Honey</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-amber-900 font-semibold mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-amber-700">
              <li>📍 India</li>
              <li>📞 +91 XXXXX XXXXX</li>
              <li>✉️ hello@madhuras.com</li>
            </ul>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-6">
              {["instagram", "facebook", "twitter"].map((icon) => (
                <Link
                  key={icon}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur hover:bg-amber-300/60 transition shadow-sm"
                >
                  <Image
                    src={`/icons/${icon}.svg`}
                    alt={icon}
                    width={18}
                    height={18}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-amber-300 my-12" />

        {/* BOTTOM */}
        <div
          className={`${nunito.className} flex flex-col md:flex-row items-center justify-between text-sm text-amber-700`}
        >
          <p>
            © {new Date().getFullYear()} Madhuras. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Made with 🍯 in India
          </p>
        </div>
      </div>
    </footer>
  );
}
