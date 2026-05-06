"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";

function CategorySkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-stone-200 dark:border-stone-800 rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data.data);
      } catch {
        toast.error("Gagal memuat kategori");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Add
  const handleAdd = async () => {
    if (!addName.trim()) {
      setAddError("Nama kategori tidak boleh kosong");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      const res = await axios.post("/admin/categories", {
        name: addName.trim(),
      });
      setCategories((prev) =>
        [...prev, res.data.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      toast.success("Kategori berhasil ditambahkan");
      setAddOpen(false);
      setAddName("");
    } catch (err) {
      setAddError(err.response?.data?.message ?? "Gagal menambahkan kategori");
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setAddName("");
    setAddError("");
  };

  // Edit
  const openEdit = (category) => {
    setEditTarget(category);
    setEditName(category.name);
    setEditError("");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) {
      setEditError("Nama kategori tidak boleh kosong");
      return;
    }
    if (editName.trim() === editTarget.name) {
      setEditOpen(false);
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const res = await axios.put(`/admin/categories/${editTarget.id}`, {
        name: editName.trim(),
      });
      setCategories((prev) =>
        prev
          .map((c) => (c.id === editTarget.id ? res.data.data : c))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      toast.success("Kategori berhasil diperbarui");
      setEditOpen(false);
    } catch (err) {
      setEditError(err.response?.data?.message ?? "Gagal memperbarui kategori");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditTarget(null);
    setEditName("");
    setEditError("");
  };

  // Delete
  const openDelete = (category) => {
    setDeleteTarget(category);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/admin/categories/${deleteTarget.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Kategori berhasil dihapus");
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal menghapus kategori");
      setDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Categories
          </h1>
          <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
            {isLoading ? "Memuat..." : `${categories.length} kategori`}
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <CategorySkeleton key={i} />)
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
              <Tag className="w-5 h-5 text-stone-400" />
            </div>
            <p className="text-[15px] font-medium text-stone-900 dark:text-stone-100">
              Belum ada kategori
            </p>
            <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-1">
              Tambah kategori pertama untuk mulai
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-stone-900 dark:text-stone-100">
                    {category.name}
                  </p>
                  <p className="text-[12px] text-stone-400 dark:text-stone-500">
                    {category.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(category)}
                  className="w-8 h-8 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDelete(category)}
                  className="w-8 h-8 text-stone-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={handleAddClose}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="add-name">Category Name</Label>
            <Input
              id="add-name"
              placeholder="e.g. Electronics"
              value={addName}
              onChange={(e) => {
                setAddName(e.target.value);
                setAddError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              disabled={addLoading}
            />
            {addError && <p className="text-[12px] text-red-500">{addError}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleAddClose}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {addLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="edit-name">Category Name</Label>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                setEditError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              disabled={editLoading}
            />
            {editError && (
              <p className="text-[12px] text-red-500">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleEditClose}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={editLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {editLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <p className="text-[14px] text-stone-600 dark:text-stone-400 py-2">
            Yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {deleteTarget?.name}
            </span>
            ? Kategori yang masih dipakai auction tidak bisa dihapus.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
