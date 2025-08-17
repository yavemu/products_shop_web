import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: Props) {
  return (
    <div className="relative w-full h-64 bg-emerald-200 overflow-hidden group rounded-md">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain rounded-md transition-transform duration-400 group-hover:scale-110"
        quality={100}
      />
    </div>
  );
}
