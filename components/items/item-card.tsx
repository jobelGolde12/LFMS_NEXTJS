"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, Badge, CardContent } from "@/components/ui";
import { Item } from "@/types";
import { formatDate } from "@/lib/utils";
import { ClaimButton } from "./claim-button";

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  showClaimButton?: boolean;
}

export function ItemCard({ item, showActions = false, showClaimButton = false }: ItemCardProps) {
  const isLost = item.status === "lost";

  return (
    <Card
      hover
      className="group h-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative h-52 bg-zinc-100 dark:bg-zinc-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-zinc-300 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={isLost ? "danger" : "success"}>
            {isLost ? "Lost" : "Found"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full border border-white/50 bg-white/80 px-2.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/70 dark:text-zinc-200">
            {item.category}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="mb-3 line-clamp-1 text-lg font-semibold text-zinc-900 dark:text-white">
          {item.title}
        </h3>

        <div className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(item.date_reported)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {item.color && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-zinc-300 dark:border-zinc-600"
                  style={{ backgroundColor: item.color.toLowerCase() }}
                />
                {item.color}
              </span>
            )}
            {item.reporter_name && (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {item.reporter_name}
              </span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <Link
              href={`/items/${item.id}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              View Details
            </Link>
            {!isLost && showClaimButton && (
              <div className="mt-2">
                <ClaimButton itemId={item.id} className="w-full" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
