"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Layers, CheckCircle2, AlertCircle, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormImageUrl(cat.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "jewelry_categories");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.publicUrl) {
        setFormImageUrl(data.publicUrl);
        setFeedback({ type: "success", message: "Category banner uploaded to Cloudinary!" });
      } else {
        setFeedback({ type: "error", message: data.error || "Image upload failed" });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Error uploading image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setSubmitting(true);
      if (editingCategory) {
        // PUT update
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            slug: formSlug || undefined,
            description: formDescription,
            imageUrl: formImageUrl,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback({ type: "success", message: `Category "${formName}" successfully updated!` });
          setIsModalOpen(false);
          fetchCategories();
        } else {
          setFeedback({ type: "error", message: data.error || "Failed to update category" });
        }
      } else {
        // POST create
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            slug: formSlug || undefined,
            description: formDescription,
            imageUrl: formImageUrl,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback({ type: "success", message: `New category "${formName}" created successfully!` });
          setIsModalOpen(false);
          fetchCategories();
        } else {
          setFeedback({ type: "error", message: data.error || "Failed to create category" });
        }
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Network error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Category "${name}" deleted.` });
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete category" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to delete category" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-[#9c7936]" />
            <h1 className="text-2xl font-serif font-normal text-stone-900">
              Jewelry Categories Management
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Create, edit, or delete fine jewelry collections. All categories dynamically populate the store filters & inventory listings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="gold-btn px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Alerts */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">
          Loading catalog categories from database...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
          <Layers className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-sm font-serif font-medium text-stone-900">No categories found</h3>
          <p className="text-xs text-stone-500">Start organizing your jewelry inventory by adding your first category.</p>
          <button
            onClick={openCreateModal}
            className="gold-btn px-4 py-2 rounded-full text-xs font-medium inline-flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-3xl bg-white border border-[#ede5dc] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-40 w-full bg-[#fbf9f6] overflow-hidden">
                <img
                  src={cat.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-[10px] font-mono text-white tracking-wider">
                  /{cat.slug}
                </div>
              </div>

              <div className="p-5 space-y-2 flex-1">
                <h3 className="text-base font-serif font-medium text-stone-900">{cat.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description || "No description provided for this collection."}
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] border-t border-[#ede5dc] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#faf5ed] text-stone-700 hover:text-[#826229] transition-colors border border-[#e8ded4] text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  disabled={deletingId === cat.id}
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 transition-colors border border-[#e8ded4] hover:border-rose-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingId === cat.id ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#ede5dc] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#ede5dc]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9c7936]" />
                <h2 className="text-lg font-serif font-semibold text-stone-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#faf8f5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                placeholder="e.g. Vintage Polki Necklaces"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Input
                label="URL Slug (Optional - auto generated if blank)"
                placeholder="e.g. vintage-polki-necklaces"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe this category styling, metal alloys, and occasion..."
                  className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                  Category Banner Image
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={formImageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80"}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-[#ede5dc] shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="cat-image-file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cat-image-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf5ed] hover:bg-[#f3e7d5] border border-[#e8d5b5] text-xs font-medium text-[#826229] cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading to Cloudinary..." : "Upload Image File"}</span>
                    </label>
                    <Input
                      placeholder="Or enter direct image URL"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ede5dc]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={submitting || uploadingImage}
                  className="px-5 rounded-full"
                >
                  {submitting
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
