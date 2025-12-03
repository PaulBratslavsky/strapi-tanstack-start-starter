import { useEffect, useRef, useState } from "react";
import { cn, getStrapiMedia } from "@/lib/utils";

interface StrapiImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "className" | "loading"
  > {
  src: string;
  alt?: string | null;
  className?: string;
  aspectRatio?: "square" | "16:9" | "4:3" | "auto";
  loading?: "lazy" | "eager";
  /** Enable IntersectionObserver-based lazy loading (default: true) */
  lazyLoad?: boolean;
  /** Root margin for IntersectionObserver (default: "100px") */
  rootMargin?: string;
}

// Get aspect ratio classes
function getAspectRatioClass(aspectRatio: string) {
  const aspectClasses = {
    square: "aspect-square",
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    auto: "w-full h-auto",
  };
  return (
    aspectClasses[aspectRatio as keyof typeof aspectClasses] ||
    aspectClasses.auto
  );
}

export function StrapiImage({
  src,
  alt,
  className = "",
  aspectRatio = "auto",
  loading = "lazy",
  lazyLoad = true,
  rootMargin = "100px",
  width,
  height,
  ...rest
}: StrapiImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // On server, default to true to avoid hydration mismatch; client will use observer
  const [isInView, setIsInView] = useState(!lazyLoad);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if lazy loading disabled or no IntersectionObserver (SSR)
    if (!lazyLoad || typeof window === "undefined") return;

    // If IntersectionObserver is not supported, load immediately
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazyLoad, rootMargin]);

  if (!src) return null;

  const imageUrl = getStrapiMedia(src);

  // If explicit dimensions are provided, don't use aspect ratio container
  const hasExplicitDimensions = width !== undefined || height !== undefined;

  if (hasExplicitDimensions) {
    // Simple image without container when dimensions are specified
    if (hasError) {
      return (
        <div
          className={cn(
            "bg-gray-200 flex items-center justify-center text-gray-500 text-sm",
            className
          )}
          style={{ width, height }}
        >
          <span>Image not available</span>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{ width, height }}
      >
        {/* Skeleton placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-accent animate-pulse" />
        )}

        {/* Actual image - only load when in view */}
        {isInView && (
          <img
            src={imageUrl}
            alt={alt || ""}
            width={width}
            height={height}
            loading={loading}
            className={cn(
              "object-cover w-full h-full transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            {...rest}
          />
        )}
      </div>
    );
  }

  // Use container with aspect ratio when no explicit dimensions
  const aspectClass = getAspectRatioClass(aspectRatio);
  const containerClasses = cn(
    "relative overflow-hidden shadow-shadow border-2 border-border bg-background",
    aspectClass,
    className
  );

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gray-200 flex items-center justify-center text-gray-500 text-sm",
          aspectClass,
          className
        )}
      >
        <span>Image not available</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-accent animate-pulse" />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={imageUrl}
          alt={alt || ""}
          loading={loading}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...rest}
        />
      )}

      <div className="absolute inset-0 bg-main/50 mix-blend-multiply"></div>
    </div>
  );
}