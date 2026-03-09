"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterDropdownProps {
  paramName: string;
  options: { value: string; label: string }[];
  defaultLabel?: string;
  value?: string;
}

export function FilterDropdown({
  paramName,
  options,
  defaultLabel = "All",
  value,
}: FilterDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue) {
      params.set(paramName, nextValue);
    } else {
      params.delete(paramName);
    }
    const nextQuery = params.toString();
    if (nextQuery !== searchParams.toString()) {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }
  };

  return (
    <select
      value={value || ""}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 min-w-36 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
    >
      <option value="">{defaultLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
