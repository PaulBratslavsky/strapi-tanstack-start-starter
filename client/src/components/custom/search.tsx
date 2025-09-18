import { useRouter, useSearch } from "@tanstack/react-router";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ISearchProps {
  readonly className?: string;
}

export function Search({ className }: ISearchProps) {
  const search = useSearch({ strict: false });
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("page", "1");

    if (term) {
      currentUrl.searchParams.set("query", term);
    } else {
      currentUrl.searchParams.delete("query");
    }

    window.history.replaceState(null, "", currentUrl.toString());
    router.invalidate();
  }, 300);

  return (
    <Input
      type="text"
      placeholder="Search"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
      defaultValue={(search as any)?.query || ""}
      className={cn("", className)}
    />
  );
}