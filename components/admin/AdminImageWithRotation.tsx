"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  rotation?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
};

export function AdminImageWithRotation({
  src,
  alt,
  rotation = 0,
  fill = true,
  className = "object-cover",
  sizes,
}: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={className}
          sizes={sizes}
          unoptimized={src.startsWith("/uploads/")}
        />
      </div>
    </div>
  );
}
