import Image from "next/image";

export function WhyChooseUs() {
  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Why Choose Us?
        </h2>

        <p className="text-gray-600 mb-16">
          Pure • Natural • Trusted by Families
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { text: "100% Raw Honey" },
            { text: "No Sugar Mixing" },
            { text: "Lab Tested" },
            { text: "Fast Delivery" },
          ].map((item) => (
            <div
              key={item.text}
              className="
                group
                bg-white/60
                backdrop-blur-lg
                border border-amber-200/40
                p-8
                rounded-3xl
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-2
              "
            >
              {/* Icon */}
              <div className="relative w-14 h-14 mx-auto mb-5">
                <Image
                  src="/honeycomb.webp"   // 👈 your uploaded webp
                  alt="Honey Icon"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <p className="font-semibold text-gray-800 text-lg">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle honey glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
