"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, Badge, CardContent } from "@/components/ui";
import { Item } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  onClaim?: () => void;
}

export function ItemCard({ item, showActions = false, onClaim }: ItemCardProps) {
  const isLost = item.status === "lost";

  return (
    <Card hover className="h-full">
      <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
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
        <div className="absolute top-3 right-3">
          <Badge variant={isLost ? "danger" : "success"}>
            {isLost ? "Lost" : "Found"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2 line-clamp-1">
          {item.title}
        </h3>

        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
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
            <span>{item.category}</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{item.location}</span>
          </div>

          {item.color && (
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full border border-zinc-300"
                style={{ backgroundColor: item.color.toLowerCase() }}
              />
              <span>{item.color}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
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
        </div>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href={`/items/${item.id}`}
              className="block w-full text-center py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 transition-colors font-medium"
            >
              View Details
            </Link>
            {!isLost && onClaim && (
              <button
                onClick={onClaim}
                className="mt-2 block w-full text-center py-2 px-4 text-zinc-600 bg-zinc-50 rounded-xl hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors font-medium"
              >
                Claim This Item
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
