import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <div className={`product-image-container ${className}`}>
      {isLoading && (
        <div className="product-image-skeleton">
          <div className="pulse-animation"></div>
        </div>
      )}
      {hasError ? (
        <div className="product-image-error">
          <div className="error-placeholder">📱</div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="product-image"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          quality={90}
        />
      )}
    </div>
  );
}
