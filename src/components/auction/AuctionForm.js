"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, GripVertical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DURATION_PRESETS, UPLOAD_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import api from "@/lib/axios";

export default function AuctionForm({ categories = [] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    startingPrice: "",
    buyNowPrice: "",
    durationPreset: "",
  });

  const [images, setImages] = useState([]); // { file, preview, url, uploading, error }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // ── Field update ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ── Image upload ──────────────────────────────────────────
  const validateFile = (file) => {
    if (!UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
      return "Format tidak didukung. Gunakan JPG, PNG, atau WEBP.";
    }
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return "Ukuran file maksimal 2MB.";
    }
    return null;
  };

  const uploadFile = async (file, index) => {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploading: true, error: null } : img,
      ),
    );

    try {
      const { data: presignData } = await api.post("/upload/presigned-url", {
        fileName: file.name,
        fileType: file.type,
        folder: "auctions",
      });

      const { presignedUrl, fileUrl } = presignData.data;

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, url: fileUrl, uploading: false } : img,
        ),
      );
    } catch {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? { ...img, uploading: false, error: "Gagal upload. Coba lagi." }
            : img,
        ),
      );
    }
  };

  const addFiles = useCallback(
    (files) => {
      const remaining = UPLOAD_CONFIG.MAX_FILES - images.length;
      if (remaining <= 0) return;

      const toAdd = Array.from(files).slice(0, remaining);
      const startIndex = images.length;

      const newImages = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        url: null,
        uploading: false,
        error: validateFile(file),
      }));

      setImages((prev) => {
        const next = [...prev, ...newImages];
        newImages.forEach((img, i) => {
          if (!img.error) {
            setTimeout(() => uploadFile(img.file, startIndex + i), 0);
          }
        });
        return next;
      });
    },
    [images.length],
  );

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeImage = async (index) => {
    const img = images[index];
    if (img.url) {
      try {
        await api.delete("/upload", { data: { fileUrl: img.url } });
      } catch {
        // best-effort delete
      }
    }
    URL.revokeObjectURL(img.preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Drag reorder ──────────────────────────────────────────
  const handleDragStart = (index) => setDragIndex(index);

  const handleDragEnter = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      setDragIndex(index);
      return next;
    });
  };

  const handleDragEnd = () => setDragIndex(null);

  // ── Validate & Submit ──────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5)
      errs.title = "Judul minimal 5 karakter.";
    if (!form.description.trim() || form.description.trim().length < 20)
      errs.description = "Deskripsi minimal 20 karakter.";
    if (!form.categoryId) errs.categoryId = "Pilih kategori.";
    if (!form.startingPrice || Number(form.startingPrice) < 1000)
      errs.startingPrice = "Harga minimal Rp1.000.";
    if (
      form.buyNowPrice &&
      Number(form.buyNowPrice) <= Number(form.startingPrice)
    )
      errs.buyNowPrice = "Buy Now price harus lebih tinggi dari harga awal.";
    if (!form.durationPreset) errs.durationPreset = "Pilih durasi auction.";
    if (images.length === 0) errs.images = "Minimal 1 foto.";
    else if (images.some((img) => img.uploading))
      errs.images = "Tunggu upload selesai.";
    else if (images.some((img) => img.error))
      errs.images = "Ada foto yang gagal diupload.";
    else if (images.some((img) => !img.url))
      errs.images = "Semua foto harus berhasil diupload.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auctions", {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        startingPrice: Number(form.startingPrice),
        buyNowPrice: form.buyNowPrice ? Number(form.buyNowPrice) : null,
        durationPreset: form.durationPreset,
        images: images.map((img) => img.url),
      });

      router.push("/my-auctions");
    } catch (err) {
      const msg = err.response?.data?.message ?? "Gagal membuat auction.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const startingPriceNum = Number(form.startingPrice) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit error */}
      {errors.submit && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errors.submit}
        </div>
      )}

      {/* Foto */}
      <div className="space-y-2">
        <Label>
          Foto Auction <span className="text-red-500">*</span>
          <span className="ml-1 text-stone-400 font-normal">
            ({images.length}/{UPLOAD_CONFIG.MAX_FILES})
          </span>
        </Label>

        {/* Drop zone */}
        {images.length < UPLOAD_CONFIG.MAX_FILES && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragOver
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
                : "border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700"
            }`}
            onClick={() => document.getElementById("file-input").click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
            <p className="text-[15px] text-stone-500 dark:text-stone-400">
              Drag & drop atau{" "}
              <span className="text-amber-500 font-medium">
                klik untuk pilih
              </span>
            </p>
            <p className="text-xs text-stone-400 mt-1">
              JPG, PNG, WEBP — maks. 2MB per foto
            </p>
            <input
              id="file-input"
              type="file"
              accept={UPLOAD_CONFIG.ACCEPTED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}

        {/* Preview grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {images.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                className={`relative aspect-square rounded-lg overflow-hidden border ${
                  dragIndex === index
                    ? "border-amber-400 opacity-60"
                    : "border-stone-200 dark:border-stone-700"
                } ${index === 0 ? "ring-2 ring-amber-400" : ""}`}
              >
                <Image
                  src={img.preview}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
                {/* Overlay saat uploading */}
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* Error overlay */}
                {img.error && (
                  <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center p-1">
                    <p className="text-white text-[10px] text-center leading-tight">
                      {img.error}
                    </p>
                  </div>
                )}
                {/* First badge */}
                {index === 0 && !img.uploading && !img.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-amber-500/80 text-white text-[10px] text-center py-0.5">
                    Utama
                  </div>
                )}
                {/* Drag handle */}
                <div className="absolute top-1 left-1 text-white/70 cursor-grab">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="text-xs text-red-500">{errors.images}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Judul <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Contoh: iPhone 14 Pro Max 256GB Space Black"
          className={errors.title ? "border-red-400" : ""}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Deskripsi <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsikan kondisi, spesifikasi, dan detail item..."
          rows={5}
          className={errors.description ? "border-red-400" : ""}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Category & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            Kategori <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.categoryId}
            onValueChange={(val) => handleSelect("categoryId", val)}
          >
            <SelectTrigger
              className={errors.categoryId ? "border-red-400" : ""}
            >
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">{errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Durasi Auction <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.durationPreset}
            onValueChange={(val) => handleSelect("durationPreset", val)}
          >
            <SelectTrigger
              className={errors.durationPreset ? "border-red-400" : ""}
            >
              <SelectValue placeholder="Pilih durasi" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_PRESETS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.durationPreset && (
            <p className="text-xs text-red-500">{errors.durationPreset}</p>
          )}
        </div>
      </div>

      {/* Starting Price & Buy Now Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startingPrice">
            Harga Awal <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              Rp
            </span>
            <Input
              id="startingPrice"
              name="startingPrice"
              type="number"
              min={1000}
              value={form.startingPrice}
              onChange={handleChange}
              placeholder="0"
              className={`pl-9 ${errors.startingPrice ? "border-red-400" : ""}`}
            />
          </div>
          {startingPriceNum >= 1000 && (
            <p className="text-xs text-stone-400">
              {formatCurrency(startingPriceNum)}
            </p>
          )}
          {errors.startingPrice && (
            <p className="text-xs text-red-500">{errors.startingPrice}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="buyNowPrice">
            Buy Now Price{" "}
            <span className="text-stone-400 font-normal text-xs">
              (opsional)
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              Rp
            </span>
            <Input
              id="buyNowPrice"
              name="buyNowPrice"
              type="number"
              min={1000}
              value={form.buyNowPrice}
              onChange={handleChange}
              placeholder="0"
              className={`pl-9 ${errors.buyNowPrice ? "border-red-400" : ""}`}
            />
          </div>
          {Number(form.buyNowPrice) >= 1000 && (
            <p className="text-xs text-stone-400">
              {formatCurrency(Number(form.buyNowPrice))}
            </p>
          )}
          {errors.buyNowPrice && (
            <p className="text-xs text-red-500">{errors.buyNowPrice}</p>
          )}
          <p className="text-xs text-stone-400">
            Akan nonaktif otomatis setelah ada bid pertama.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
          className="flex-1 sm:flex-none"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white"
        >
          {submitting ? "Mengirim..." : "Submit Auction"}
        </Button>
      </div>
    </form>
  );
}
