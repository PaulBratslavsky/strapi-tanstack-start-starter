import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

interface SmartLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * SmartLink - A unified link component that handles both internal and external URLs
 *
 * - Internal links: Uses TanStack Router's Link for client-side navigation
 * - External links: Uses native <a> tag with security attributes
 *
 * External links are detected by checking if the URL starts with http://, https://, or //
 */
export function SmartLink({ href, children, className, ...props }: SmartLinkProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} {...props}>
      {children}
    </Link>
  );
}
