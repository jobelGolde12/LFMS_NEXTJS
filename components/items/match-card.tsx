"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button } from "@/components/ui";
import { ItemMatch } from "@/types";
import { formatDate } from "@/lib/utils";
import { ClaimButton } from "./claim-button";

interface MatchCardProps {
  match: ItemMatch;
  onStatusChange?: (id: string, status: string) => void;
}

export function MatchCard({ match, onStatusChange }: MatchCardProps) {
  const getBadgeVariant = () => {
    if (match.status === "confirmed") return "success" as const;
    if (match.status === "rejected") return "danger" as const;
    return "warning" as const;
  };

  const reasons = [
    { label: "Same item type", pass: match.lost_item?.category === match.found_item?.category },
    {
      label: "Similar color",
      pass:
        !!match.lost_item?.color &&
        !!match.found_item?.color &&
        match.lost_item.color.toLowerCase() === match.found_item.color.toLowerCase(),
    },
    {
      label: "Same location",
      pass: match.lost_item?.location.toLowerCase() === match.found_item?.location.toLowerCase(),
    },
    {
      label: "Close reporting date",
      pass:
        !!match.lost_item?.date_reported &&
        !!match.found_item?.date_reported &&
        Math.abs(
          new Date(match.lost_item.date_reported).getTime() - new Date(match.found_item.date_reported).getTime()
        ) <=
          7 * 24 * 60 * 60 * 1000,
    },
    {
      label: "Brand match",
      pass:
        !!match.lost_item?.brand &&
        !!match.found_item?.brand &&
        match.lost_item.brand.toLowerCase() === match.found_item.brand.toLowerCase(),
    },
  ];
  const displayReasons =
    match.matched_attributes && match.matched_attributes.length > 0
<<<<<<< HEAD
      ? match.matched_attributes.map((label) => ({ label, pass: true }))
=======
      ? match.matched_attributes.map((label: string) => ({ label, pass: true }))
>>>>>>> main2
      : reasons;

  return (
    <Card className="rounded-2xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant={getBadgeVariant()}>{match.status}</Badge>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{match.score}% Match</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <MatchItemColumn
          title="Lost Item"
          tone="text-red-600"
          item={match.lost_item}
        />

        <div className="hidden items-center justify-center lg:flex">
          <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-300">
            Match
          </span>
        </div>

        <MatchItemColumn
          title="Found Item"
          tone="text-emerald-600"
          item={match.found_item}
        />
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Matching attributes</p>
        <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
<<<<<<< HEAD
          {displayReasons.map((reason) => (
=======
          {displayReasons.map((reason: { label: string; pass: boolean }) => (
>>>>>>> main2
            <li key={reason.label} className="flex items-center gap-2">
              <span className={reason.pass ? "text-emerald-600" : "text-zinc-400"}>{reason.pass ? "✔" : "•"}</span>
              {reason.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Link
          href={`/items/${match.lost_item_id}`}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          View Lost Item
        </Link>
        <Link
          href={`/items/${match.found_item_id}`}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          View Found Item
        </Link>
        <ClaimButton itemId={match.found_item_id} />
      </div>

      {onStatusChange && match.status === "suggested" && (
        <div className="mt-4 flex justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <Button variant="outline" size="sm" onClick={() => onStatusChange(match.id, "rejected")}>
            Reject
          </Button>
          <Button variant="primary" size="sm" onClick={() => onStatusChange(match.id, "confirmed")}>
            Confirm Match
          </Button>
        </div>
      )}
    </Card>
  );
}

function MatchItemColumn({
  title,
  tone,
  item,
}: {
  title: string;
  tone: string;
  item: ItemMatch["lost_item"];
}) {
  return (
    <div className="space-y-3">
      <p className={`text-xs font-semibold uppercase tracking-wider ${tone}`}>{title}</p>
      <div className="relative h-36 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        {item?.image_url ? (
          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-zinc-900 dark:text-white">{item?.title || "Unknown Item"}</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{item?.category || "Unknown category"}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {item?.location || "Unknown location"} • {item?.date_reported ? formatDate(item.date_reported) : "Unknown date"}
        </p>
      </div>
    </div>
  );
}
