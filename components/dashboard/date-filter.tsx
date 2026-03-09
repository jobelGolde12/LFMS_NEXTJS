"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DateFilterProps {
  paramName?: string;
  value?: string;
}

export function DateFilter({ paramName = "date", value = "" }: DateFilterProps) {
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
    <input
      type="date"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
    />
  );
}
