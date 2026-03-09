"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { CATEGORIES, COLORS } from "@/types";

interface ItemFormProps {
  status: "lost" | "found";
}

export function ItemForm({ status }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    color: "",
    brand: "",
    description: "",
    location: "",
    date_reported: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(status === "lost" ? "/lost-items" : "/found-items");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));
  const colorOptions = COLORS.map((c) => ({ value: c, label: c }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="Item Name"
        placeholder="e.g., MacBook Pro, Blue Backpack"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Select
        label="Category"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Color"
          options={colorOptions}
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />

        <Input
          label="Brand"
          placeholder="e.g., Apple, Nike"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
      </div>

      <Input
        label="Location"
        placeholder="e.g., Library, Main Building"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />

      <Input
        label="Date"
        type="date"
        value={formData.date_reported}
        onChange={(e) => setFormData({ ...formData, date_reported: e.target.value })}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe the item in detail..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={4}
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : `Report ${status === "lost" ? "Lost" : "Found"} Item`}
        </Button>
      </div>
    </form>
  );
}
