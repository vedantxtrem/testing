import Image from "next/image";

interface Props {
  imageSrc: string;
  title: string;
  description: string;
  dripColor: string;
}

export default function TypesCard({
  imageSrc,
  title,
  description,
  dripColor,
}: Props) {
  return (
    <div
      className={`group relative w-full max-w-sm mx-auto rounded-[32px] 
      backdrop-blur-xl ${dripColor} shadow-2xl 
      overflow-hidden transition-all duration-500 hover:-translate-y-2`}
    >
      {/* 🍯 Top Honey Strip */}
      <div className={`absolute top-0 left-0 w-full h-2 ${dripColor}`} />

      {/* Image section (same width as card) */}
      <div className="relative w-full h-56">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        <p className="text-gray-700 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
