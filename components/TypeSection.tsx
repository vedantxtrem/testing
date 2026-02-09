import Image from "next/image";
import TypesCard from "./TypeCard";

export default function TypeSection() {
  return (
    <section className="relative px-4 md:px-0 mb-32 bg-gradient-to-b from-yellow-50 to-white overflow-hidden pt-5">

      {/* 🐝 Honeycomb animated background */}
      <div className="absolute inset-0 bg-honeycomb opacity-10 animate-float z-0" />

      {/* 🌿 Decorative floating elements */}
      <Image
        src="/element/hexgon.webp"
        alt="hexagon"
        width={120}
        height={120}
        className="absolute top-10 left-10 hidden md:block opacity-30 z-0"
      />

      <Image
        src="/element/vector.webp"
        alt="vector"
        width={120}
        height={120}
        className="absolute top-12 left-[30%] hidden md:block opacity-30 z-0"
      />

      <Image
        src="/element/hexgon.webp"
        alt="hexagon"
        width={120}
        height={120}
        className="absolute top-16 right-[10%] hidden md:block opacity-30 z-0"
      />

      {/* 🖼️ Center background SVG */}
      <div
        className="absolute inset-0 z-0 mx-auto animate-pulse"
        style={{
          backgroundImage: `url('/image/bg.svg')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "90%",
          height: "90%",
          top: "5%",
        }}
      />

      {/* 🔥 Heading */}
      <div className="relative z-10 text-center mb-20">
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
          ABOUT OUR PRODUCTS
        </h2>

        <h1 className="text-3xl md:text-5xl font-black font-harman tracking-tight text-gray-900 my-4">
          Types of Honey
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Take a look at the different types of honey we produce.
        </p>

        {/* Honey dots animation */}
        <div className="absolute right-6 top-2 grid grid-cols-5 gap-2 opacity-20 animate-honeycomb">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-amber-400 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* 🍯 Honey Cards */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14">
        <TypesCard
          imageSrc="/stock/mustard.webp"
          title="Mustard Honey"
          description="Earthy flavour with a subtle spice, sourced from mustard blossoms."
          dripColor="bg-amber-400"
        />

        <TypesCard
          imageSrc="/stock/multiflora.webp"
          title="Multiflora Honey"
          description="A rich fusion of wildflower nectars packed with goodness."
          dripColor="bg-emerald-400"
        />

        <TypesCard
          imageSrc="/stock/litchi.webp"
          title="Litchi Honey"
          description="Light floral sweetness with fruity aroma."
          dripColor="bg-pink-400"
        />
      </div>
    </section>
  );
}
