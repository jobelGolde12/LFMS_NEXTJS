"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

interface ClaimButtonProps {
  itemId: string;
  className?: string;
}

export function ClaimButton({ itemId, className }: ClaimButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit claim");
      }

      setMessage("Claim submitted. Admin will review your request.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button type="button" variant="outline" size="sm" onClick={handleClaim} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Claim Item"}
      </Button>
      {message && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
