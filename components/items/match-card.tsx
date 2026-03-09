"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Badge, Button } from "@/components/ui";
import { ItemMatch } from "@/types";
import { formatDate } from "@/lib/utils";

interface MatchCardProps {
  match: ItemMatch;
  onStatusChange?: (id: string, status: string) => void;
}

export function MatchCard({ match, onStatusChange }: MatchCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (status: string) => {
    if (!onStatusChange) return;
    setUpdating(true);
    try {
      await onStatusChange(match.id, status);
    } finally {
      setUpdating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-zinc-600";
  };

  const getBadgeVariant = () => {
    if (match.status === "confirmed") return "success";
    if (match.status === "rejected") return "danger";
    return "warning";
  };

  return (
    <Card className="overflow-visible">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          flex items-center space<div className="-x-3">
            <Badge variant={getBadgeVariant()}>
              {match.status}
            </Badge>
            <span className={`text-2xl font-bold ${getScoreColor(match.score)}`}>
              {match.score}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              Lost Item
            </div>
            <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {match.lost_item?.image_url ? (
                <Image
                  src={match.lost_item.image_url}
                  alt={match.lost_item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6 0 00a2 2-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">
                {match.lost_item?.title}
              </h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {match.lost_item?.location} • {formatDate(match.lost_item?.date_reported || "")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Found Item
            </div>
            <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {match.found_item?.image_url ? (
                <Image
                  src={match.found_item.image_url}
                  alt={match.found_item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">
                {match.found_item?.title}
              </h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {match.found_item?.location} • {formatDate(match.found_item?.date_reported || "")}
              </p>
            </div>
          </div>
        </div>

        {onStatusChange && match.status === "suggested" && (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("rejected")}
              disabled={updating}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange("confirmed")}
              disabled={updating}
            >
              Confirm Match
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
