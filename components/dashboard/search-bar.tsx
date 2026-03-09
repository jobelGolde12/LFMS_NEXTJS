"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  paramName?: string;
  initialValue?: string;
}

export function SearchBar({
  placeholder = "Search...",
  paramName = "search",
  initialValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set(paramName, value.trim());
        } else {
          params.delete(paramName);
        }
        const nextQuery = params.toString();
        const currentQuery = searchParams.toString();
        if (nextQuery !== currentQuery) {
          router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
        }
      }, 300),
    [pathname, router, searchParams, paramName]
  );

  useEffect(() => {
    applyQuery(query);
  }, [query, applyQuery]);

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
