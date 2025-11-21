import { useState } from "react";
import { cn, getStrapiMedia} from "@/lib/utils"

interface StrapiImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className' | 'loading'> {
  src: string;
  alt?: string | null;
  className?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'auto';
  loading?: 'lazy' | 'eager';
}


// Get aspect ratio classes
function getAspectRatioClass(aspectRatio: string) {
  const aspectClasses = {
    square: "aspect-square",
    "16:9": "aspect-video", 
    "4:3": "aspect-[4/3]",
    auto: "w-full h-auto"
  };
  return aspectClasses[aspectRatio as keyof typeof aspectClasses] || aspectClasses.auto;
}

export function StrapiImage({
  src,
  alt,
  className = "",
  aspectRatio = 'auto',
  loading = 'lazy',
  width,
  height,
  ...rest
}: StrapiImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src) return null;

  const imageUrl = getStrapiMedia(src);

  // If explicit dimensions are provided, don't use aspect ratio container
  const hasExplicitDimensions = width !== undefined || height !== undefined;

  if (hasExplicitDimensions) {
    // Simple image without container when dimensions are specified
    if (hasError) {
      return (
        <div
          className={cn("bg-gray-200 flex items-center justify-center text-gray-500 text-sm", className)}
          style={{ width, height }}
        >
          <span>Image not available</span>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={alt || ""}
        width={width}
        height={height}
        loading={loading}
        className={cn("object-cover", className)}
        onError={() => setHasError(true)}
        {...rest}
      />
    );
  }

  // Use container with aspect ratio when no explicit dimensions
  const aspectClass = getAspectRatioClass(aspectRatio);
  const containerClasses = cn(
    "relative overflow-hidden shadow-shadow border-2 border-border bg-background",
    aspectClass,
    className
  );

  const imageClasses = "w-full h-full object-cover";

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${aspectClass} ${className}`}>
        <span>Image not available</span>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <img
        src={imageUrl}
        alt={alt || ""}
        loading={loading}
        className={imageClasses}
        onError={() => setHasError(true)}
        {...rest}
      />
      <div className="absolute inset-0 bg-main/50 mix-blend-multiply"></div>
    </div>
  );
}