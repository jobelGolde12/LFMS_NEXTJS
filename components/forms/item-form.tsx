"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { CATEGORIES, COLORS } from "@/types";

interface ItemFormProps {
  status: "lost" | "found";
}

interface FormErrors {
  title?: string;
  category?: string;
  location?: string;
  date_reported?: string;
}

export function ItemForm({ status }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    color: "",
    brand: "",
    description: "",
    location: "",
    date_reported: new Date().toISOString().split("T")[0],
    image_url: "",
  });

  const categoryOptions = useMemo(() => CATEGORIES.map((c) => ({ value: c, label: c })), []);
  const colorOptions = useMemo(() => COLORS.map((c) => ({ value: c, label: c })), []);

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Item name is required";
    if (!formData.category) nextErrors.category = "Category is required";
    if (!formData.location.trim()) nextErrors.location = `Location ${status === "lost" ? "lost" : "found"} is required`;
    if (!formData.date_reported) nextErrors.date_reported = `Date ${status === "lost" ? "lost" : "found"} is required`;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = () => {
      const interval = setInterval(() => {
        setUploadProgress((current) => {
          if (current >= 100) {
            clearInterval(interval);
            setUploadingImage(false);
            setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
            return 100;
          }
          return current + 20;
        });
      }, 70);
    };

    reader.onerror = () => {
      setUploadingImage(false);
      setUploadProgress(0);
      setError("Could not read image file");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validate()) return;

    setLoading(true);

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

      setSuccessMessage(
        status === "found"
          ? "Thank you for reporting the found item. The system will automatically check for possible matches."
          : "Lost item report submitted successfully. We will notify you when a potential match is found."
      );

      setTimeout(() => {
        router.push(status === "lost" ? "/lost-items" : "/found-items");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Item Name"
          placeholder="e.g., MacBook Pro, Blue Backpack"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          error={errors.category}
          required
        />

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

        <Input
          label={status === "lost" ? "Location Lost" : "Location Found"}
          placeholder="e.g., Library, Main Building"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          error={errors.location}
          required
        />

        <Input
          label={status === "lost" ? "Date Lost" : "Date Found"}
          type="date"
          value={formData.date_reported}
          onChange={(e) => setFormData({ ...formData, date_reported: e.target.value })}
          error={errors.date_reported}
          required
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Describe the item in detail..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={4}
      />

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-700 dark:text-zinc-200"
        />
        {uploadingImage && (
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-2 rounded-full bg-emerald-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">Uploading... {uploadProgress}%</p>
          </div>
        )}
        {formData.image_url && !uploadingImage && (
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={formData.image_url} alt="Preview" className="h-44 w-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploadingImage}>
          {loading
            ? "Submitting..."
            : status === "lost"
              ? "Submit Lost Item Report"
              : "Submit Found Item Report"}
        </Button>
      </div>
    </form>
  );
}
